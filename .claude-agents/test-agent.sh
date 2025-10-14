#!/bin/bash
# Test script to verify agent integration

echo "🧪 Testing Contains Studio Agents Integration..."
echo ""

# Test if settings file exists
if [ -f ".claude-agents/settings.json" ]; then
    echo "✓ Settings file found"
else
    echo "✗ Settings file not found"
    exit 1
fi

# Test basic agent invocation
echo ""
echo "Testing agent response..."
echo ""

claude --settings .claude-agents/settings.json --print "List all available specialized agents" | head -20

echo ""
echo "✓ Agent integration test complete!"
echo ""
echo "Try these examples:"
echo "  claude --settings .claude-agents/settings.json '@backend-architect design an auth API'"
echo "  claude --settings .claude-agents/settings.json '@ui-designer create a dashboard'"
echo "  claude --settings .claude-agents/settings.json '@trend-researcher what is trending on TikTok?'"


