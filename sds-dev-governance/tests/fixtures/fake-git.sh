#!/usr/bin/env bash
set -euo pipefail
printf '%q ' "$@" >> "$SDS_FAKE_GIT_LOG"
printf '\n' >> "$SDS_FAKE_GIT_LOG"
