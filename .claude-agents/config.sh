#!/bin/bash
# Add this to your shell profile (~/.zshrc) to always have agents available in this project

# When in FlowStateMax directory, use Claude with studio agents
if [[ "$PWD" == *"FlowStateMax"* ]]; then
    alias claude='claude --settings ~/.local/FlowStateMax/.claude-agents/settings.json'
fi

