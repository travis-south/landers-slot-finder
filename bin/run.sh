#!/usr/bin/env bash

yarn install
while true; do yarn run test; sleep 1; done
