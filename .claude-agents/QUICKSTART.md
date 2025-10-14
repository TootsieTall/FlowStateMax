# Contains Studio Agents - Quick Start for Cursor

All 53 Contains Studio agents are now ready to use in Cursor! 🎉

## ⚡ Three Ways to Use the Agents

### Method 1: Direct Command (Recommended)
Use the wrapper script for easy access:

```bash
./.claude-agents/studio-agent "@backend-architect design a REST API for user management"
```

### Method 2: Full Command
Use Claude CLI with settings flag:

```bash
claude --settings .claude-agents/settings.json "@ui-designer create a modern dashboard"
```

### Method 3: In Cursor Chat
When using Cursor's AI chat, you can reference agent expertise in your prompts:

```
"Acting as the backend-architect agent, design a scalable user authentication system"
```

## 🎯 Popular Agents and When to Use Them

### Building Features
- **@rapid-prototyper** - Quickly scaffold new apps and MVPs
- **@frontend-developer** - Build React/Vue interfaces
- **@backend-architect** - Design APIs and databases
- **@mobile-app-builder** - Create native mobile experiences

### Finding Opportunities
- **@trend-researcher** - Identify viral trends from TikTok and social media
- **@tiktok-strategist** - Create TikTok marketing strategies
- **@feedback-synthesizer** - Analyze user feedback for insights

### Improving Quality
- **@security-engineer** - Audit for vulnerabilities
- **@performance-engineer** - Optimize speed and efficiency
- **@test-writer-fixer** - Write and fix tests
- **@refactoring-expert** - Improve code quality

### Design & UX
- **@ui-designer** - Create beautiful interfaces
- **@ux-researcher** - Understand user needs
- **@whimsy-injector** - Add delightful touches
- **@brand-guardian** - Ensure brand consistency

### Operations
- **@devops-automator** - Setup CI/CD pipelines
- **@infrastructure-maintainer** - Monitor system health
- **@support-responder** - Handle customer support

### Business & Strategy
- **@business-panel-experts** - Get multi-expert business advice
- **@sprint-prioritizer** - Plan 6-day development cycles
- **@experiment-tracker** - Track A/B tests and experiments

## 🧪 Test the Integration

Run the test script to verify everything works:

```bash
./.claude-agents/test-agent.sh
```

## 💡 Example Commands

### Design a new feature
```bash
./.claude-agents/studio-agent "@backend-architect design a social sharing API with OAuth integration"
```

### Find trending opportunities
```bash
./.claude-agents/studio-agent "@trend-researcher what TikTok trends could we build an app around?"
```

### Improve existing code
```bash
./.claude-agents/studio-agent "@refactoring-expert analyze and improve the authentication module"
```

### Plan a sprint
```bash
./.claude-agents/studio-agent "@sprint-prioritizer help me prioritize these 20 features for a 6-day sprint"
```

### Optimize performance
```bash
./.claude-agents/studio-agent "@performance-engineer identify bottlenecks in our API response times"
```

## 📚 Full Agent List

See `USAGE.md` for the complete list of all 53 agents organized by category.

## 🔄 Update Agents

To get the latest agents from Contains Studio:

```bash
cd ~/.claude/subagents
git pull
cd /path/to/FlowStateMax
python3 convert_agents.py
```

## 🆘 Troubleshooting

**Agents not responding correctly?**
- Ensure the settings file exists: `ls -la .claude-agents/settings.json`
- Verify Claude CLI is installed: `which claude`
- Check the conversion worked: `cat .claude-agents/USAGE.md`

**Need to add more agents?**
- Add `.md` files to `~/.claude/subagents/`
- Run `python3 convert_agents.py` to regenerate configs

---

**Pro Tip**: Add `./.claude-agents/studio-agent` to your PATH for even easier access!

```bash
# Add to ~/.zshrc
export PATH="$PATH:/Users/authoydas/Desktop/FlowStateMax/.claude-agents"

# Then just use:
studio-agent "@ui-designer create a login page"
```


