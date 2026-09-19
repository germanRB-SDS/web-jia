#!/usr/bin/env python3
"""Pure sensor regressions plus own pipe drainage and recorded guest schema replay.

No VM, live sensor, subject, signals, credentials or network. Clock is synthetic.
"""
import json
import os
from pathlib import Path
import sys
import types
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from sentinel.beta.protocol import ControlFailure, encode
from sentinel.beta.sensor import ESStream, SensorSpec, SensorPump


class SensorHealthTests(unittest.TestCase):
    def setUp(self):
        self.now, self.raw, self.events, self.failures = [10.0], [], [], []
        self.spec = SensorSpec('fixture', 'a'*64, 1, frozenset({32, 11, 9, 15}), 0, 0, 32)
        self.stream = ESStream(self.spec, instance='fixture', sensor_pgid=100, subject_pgid=200,
            raw_sink=self.raw.append, event_sink=self.events.append, failure_sink=self.failures.append,
            clock=lambda: self.now[0], canary_ttl=1)

    def event(self, seq=0):
        return {'schema_version':1,'event_type':32,'seq_num':seq,'global_seq_num':seq,
            'process':{'audit_token':{'pid':201,'pidversion':3}},'event':{'path':'fixture-'+str(seq)}}

    def canary(self, seq=0):
        event = self.event(seq)
        self.stream.feed(encode(event)+b'\n')
        self.stream.confirm_canary(event, expected_token=event['process']['audit_token'], expected_event=event['event'])

    def test_never_healthy_before_canary(self):
        self.assertFalse(self.stream.canary_health())

    def test_live_silent_sensor_expires_despite_ticks(self):
        read, write = os.pipe()
        reader = os.fdopen(read, 'rb', buffering=0)
        pump = SensorPump(types.SimpleNamespace(stdout=reader,poll=lambda:None), self.stream)
        try:
            self.canary(); self.assertTrue(pump.health())
            self.now[0] += 1.001
            pump.tick()
            with self.assertRaisesRegex(ControlFailure,'SENSOR_CANARY_EXPIRED'): pump.health()
        finally:
            pump.close(); reader.close(); os.close(write)

    def test_new_canary_renews_but_replay_does_not(self):
        self.canary(); self.now[0]+=0.8; self.canary(1); self.now[0]+=0.8
        self.assertTrue(self.stream.canary_health())
        e=self.event(1)
        with self.assertRaisesRegex(ControlFailure,'SENSOR_CANARY_REPLAY'):
            self.stream.confirm_canary(e,expected_token=e['process']['audit_token'],expected_event=e['event'])

    def test_delayed_confirmation_cannot_renew_old_observation(self):
        e=self.event(); self.stream.feed(encode(e)+b'\n'); self.now[0]+=1
        with self.assertRaisesRegex(ControlFailure,'SENSOR_CANARY_EXPIRED'):
            self.stream.confirm_canary(e,expected_token=e['process']['audit_token'],expected_event=e['event'])

    def test_unrelated_events_do_not_renew_canary(self):
        self.canary(); self.now[0]+=0.8; self.stream.feed(encode(self.event(1))+b'\n'); self.now[0]+=0.3
        with self.assertRaisesRegex(ControlFailure,'SENSOR_CANARY_EXPIRED'): self.stream.canary_health()

    def test_new_canary_after_expiry_cannot_hide_missed_deadline(self):
        self.canary(); self.now[0]+=2
        with self.assertRaisesRegex(ControlFailure,'SENSOR_CANARY_EXPIRED'): self.canary(1)

    def test_eof_preserves_partial_bytes_after_failure_callback(self):
        self.stream.failure_sink=lambda reason:self.failures.append((reason,len(self.raw)))
        self.stream.feed(b'{partial')
        with self.assertRaises(ControlFailure): self.stream.eof()
        self.assertEqual(b''.join(self.raw),b'{partial')
        self.assertEqual(self.failures,[('SENSOR_EOF_PARTIAL',0)])

    def test_bad_line_retains_already_received_following_bytes(self):
        data=b'not json\nremaining partial'
        with self.assertRaises(ControlFailure): self.stream.feed(data)
        self.assertEqual(b''.join(self.raw),data)

    def test_dead_producer_fences_then_drains_without_dispatch(self):
        read,write=os.pipe(); reader=os.fdopen(read,'rb',buffering=0)
        data=encode(self.event())+b'\n{partial'; os.write(write,data); os.close(write)
        pump=SensorPump(types.SimpleNamespace(stdout=reader,poll=lambda:0),self.stream)
        self.stream.failure_sink=lambda reason:self.failures.append((reason,len(self.raw)))
        try:
            with self.assertRaises(ControlFailure): pump.tick()
            self.assertEqual(b''.join(self.raw),data); self.assertEqual(self.events,[])
            self.assertEqual(self.failures,[('SENSOR_EXIT',0)])
            self.assertFalse(pump.terminal_drain_incomplete)
        finally: pump.close();reader.close()

    def test_live_extra_pipe_writer_keeps_drain_unknown(self):
        read,write=os.pipe();reader=os.fdopen(read,'rb',buffering=0)
        pump=SensorPump(types.SimpleNamespace(stdout=reader,poll=lambda:0),self.stream)
        try:
            with self.assertRaises(ControlFailure):pump.tick()
            self.assertTrue(pump.terminal_drain_incomplete)
        finally:pump.close();reader.close();os.close(write)

    def test_health_observes_death_first_and_preserves_all_bytes(self):
        read,write=os.pipe();reader=os.fdopen(read,'rb',buffering=0)
        self.stream.feed(b'{start');os.write(write,b'tail');os.close(write)
        pump=SensorPump(types.SimpleNamespace(stdout=reader,poll=lambda:0),self.stream)
        try:
            with self.assertRaises(ControlFailure):pump.health()
            self.assertEqual(b''.join(self.raw),b'{starttail')
            self.assertEqual(self.failures,['SENSOR_EOF_PARTIAL'])
            self.assertFalse(pump.terminal_drain_incomplete)
        finally:pump.close();reader.close()

    def test_recorded_native_schema_replays_without_canary_admission(self):
        path=Path(__file__).resolve().parents[1]/'docs/prompts-output/[01-5]/evidence/sensor-run-stdout.jsonl'
        raw=path.read_bytes()
        for start in range(0,len(raw),32768): self.stream.feed(raw[start:start+32768])
        self.assertEqual(self.stream.count,83)
        self.assertEqual(b''.join(self.raw),raw)
        self.assertEqual(self.stream.global_next,83)
        self.assertFalse(self.stream.canary_health())


if __name__=='__main__': unittest.main(verbosity=2)
