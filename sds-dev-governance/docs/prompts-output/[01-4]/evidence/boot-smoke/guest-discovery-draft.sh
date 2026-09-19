# DRAFT: not admitted or executed. Guest-only read-only commands, no sudo.
/usr/bin/id
/usr/bin/sw_vers
/sbin/mount
/sbin/ifconfig -a
/usr/sbin/netstat -rn
for tool in python3 node codex claude sandbox-exec; do command -v "$tool" || true; done
