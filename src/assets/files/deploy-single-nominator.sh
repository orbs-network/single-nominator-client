#!/bin/bash

# Check if the pools directory exists and create it if not
pools_dir="$HOME/.local/share/mytoncore/pools"
if [ ! -d "$pools_dir" ]; then
    mkdir -p "$pools_dir"
fi

# Copy single-nominator.addr to pools directory
cp single-nominator.addr "$pools_dir/"

# Check if contracts/nominator-pool/func/ directory exists and create it if not
contracts_dir="$HOME/.local/share/mytoncore/contracts/nominator-pool/func"
if [ ! -d "$contracts_dir" ]; then
    mkdir -p "$contracts_dir"
fi

# Copy necessary files to contracts/nominator-pool/func/ directory
cp recover-stake.fif validator-elect-signed.fif validator-withdraw.fif "$contracts_dir/"
