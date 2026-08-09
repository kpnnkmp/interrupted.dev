---
title: When coding gets cheap, engineering gets harder
date: 2026-08-09
tags:
  - ai
  - engineering
layout: post
description: >-
  Teams plateau after the first gains from AI coding tools. Moving beyond it means engineering the system around the agent, not reaching for a better model.
---

::: callout
At the beginning of this year (2026) I assumed a new role of "Head of Technical Innovation" within [Finaps](https://finaps.nl). Within this role I am (amongst other things) responsible to figure out what agentic engineering means for the future of the company. Within this setting, I wrote this thought leadership article for Finaps. The version posted here is my final _draft_. The final version can be found [here](https://finaps.nl/the-future-of-engineering/).
:::

Many software engineers have already experimented with agentic AI and AI-assisted software development, using tools like Claude Code and Codex to write code. They might rely on AI to generate a complex database query that would otherwise take time to get right, or to speed up specific parts of a problem once enough context is provided.

But for many teams, the productivity gains stop there. Switching to a newer or more capable model rarely leads to another significant leap in efficiency, and simply giving more people access to AI doesn't solve the problem either. So what does it actually take to move beyond isolated productivity gains and unlock the next level of AI-assisted engineering? And what does that investment really cost?

Agentic, or AI-augmented, engineering is the next step. AI is no longer just a tool you use, it becomes a system you build around. One with clear codified standards, well-defined prompts, and governance that ensures AI agents operate consistently. With that foundation in place, the engineering challenge shifts from simply building a solution to deciding what should be built in the first place.

## Tool adoption is easy, systems engineering is hard

There are many more levels of adoption between tool adoption and a full AI system. Most maturity models for AI adoption in software engineering settle on around eight levels. When you use agents to solve isolated coding tasks, you are near the bottom of this ladder. The first step in moving up is building up context for the agent. You feed it structured information about decisions made for the solution, or coding conventions used across teams. But at all times, the engineer is still steering and determining what the agent is allowed to do.

The next step is making the agent more autonomous. This is the point where most engineering teams plateau. To make the agent more autonomous, you have to start building systems. The software development lifecycle is the same for all engineering teams at a high level. But the details differ between engineers, teams, organisations and technologies. In some cases quality checks can be tied to a programming language and IDE, while in others specific scripts and gates need to be created. Some teams want tight alignment between technical documentation and code, while others want the code to speak for itself. Building an autonomous _loop_ for the agent that does what matters for your team or organisation requires understanding _your_ software development lifecycle in detail. It requires codifying the standards and knowledge that were tacit up until now. By doing so, you can create a system that prompts itself. What is called _loop engineering_.

## Why regulated teams can't take the fast path

At this point you have not reached the top levels of the agentic engineering maturity ladder. Up until now, everything is pretty much contained on a developer's local machine. Moving beyond that, especially in a regulated market, requires complex system and platform engineering. The easiest way to explain that is with a common example. Engineering teams always look to optimise themselves, so naturally they want to start connecting their AI agent to internal systems through the Model Context Protocol (MCP). For instance, connecting the agent to a logging and monitoring system. When production issues are logged, the AI system can identify, debug and solve them: a _self-healing system_.

But this is where the complexity often halts progress. Access to a logging and monitoring system is a standing privilege, and if your organisation follows ISO 27001, every use of privileged access needs to be properly logged and attributable. A certain governance posture is required. The natural response is to give the agent the developer's account, their internal identity. But sharing a personal developer identity with an autonomous agent creates unmanaged risk against controls the standard explicitly expects you to manage: unique, attributable identities (A.5.16), authentication information that isn't shared (A.5.17), and controlled privileged access (A.8.2). And there is a sharper problem underneath. The agent is reading the very logs whose integrity its own access model breaks: acting under the developer's identity, its actions are recorded against the human, so the logging control meant to establish who did what (A.8.15) can no longer answer that question. Unattended autonomy of this kind also sits in tension with the EU AI Act, which requires _human oversight_ for high-risk systems.

A better approach is to give each agent its _own identity_. But that is not possible when every developer controls which agents run on their laptop. The way forward is to create a new, central sandboxed environment. The organisation is now in full control of the boundaries of this system and of what agents run within it. Getting to this stage in the maturity cannot be fast-tracked.

## The engineer becomes the operator, not the author

You might be wondering what the difference is for engineers between a local and remote agent, and how that shapes the future of engineering. The truth is there is no one-size-fits-all coding agent. Different types of engineering teams, even within the same organisation, have different needs. A DevOps team delivering business applications has different needs from a platform team or a consumer-facing team. They all need their own variations of the AI system, and that can only happen if the engineers are part of building it.

The engineer becomes the designer and operator of the AI system. The system now authors the code that is being generated, but the engineer remains responsible. This is often called the _human-in-the-loop_, and it is codified in the ISO 42001 standard. It means the engineer must be competent enough to catch any error the AI system produces. Be it on architecture, security, or even UI design. So the engineer, or the team, needs to understand how decisions are made at every level, with or without AI, to carry that responsibility. As decisions keep coming, and standards keep evolving, the AI system keeps evolving as well.

This is where a strain comes in for engineers, too. As more code can be produced, there is a real chance of _cognitive surrender_: everything blends together, and the engineer just presses "go" and lets the AI system move forward. Engineers increasingly work on the system rather than on the solutions they build with it. That creates real risks, regardless of the guardrails in place.

## What can you do?

When building is cheap, two questions define the future of engineering: _what's worth building?_ and _how do you build it under control?_ The first question is the harder one, and it's exactly the one this shift pushes to the centre. When you can build almost anything, building the wrong thing well becomes the expensive mistake. But that question is no longer really an engineering one.

The second is one your IT organisation can answer. It starts with an honest look at where your organisation sits on the AI-adoption ladder. And it's worth being clear-eyed about the trade-off: skipping the system doesn't make you faster, it just moves the bottleneck downstream. Once you know where you stand, you can map the activities and investments needed to climb, step by step.
