---
title: Slightly enhanced sticky revealing footer
date: 2025-06-17
tags:
  - css
  - javascript
layout: post
description: >-
  Andy Bell showed a nice little UI effect with his “sticky revealing footer”. But on some pages the experience was mediocre, so a quest began to improve it.
---

Not too long ago, I came across a post about a [sticky revealing footer](https://piccalil.li/blog/sticky-revealing-footer/). My immediate reaction was: “I want this on my website!” And without much hesitation, it was there. You can see its effect right now.

But after a few days (actually, just one), I noticed something odd. In particular on pages with little content. To be precise, on pages that _almost_ have enough height to show the full footer, but not quite. You’d end up with a half-revealed footer hanging there awkwardly. The experience just felt... off. This had to be fixed.

## Why not stretch `<main>`?

Well, that would create a non-desired effect. When there is hardly any content on the page, I believe the footer should just show. You should not have to scroll on a 404 page with only a message to see the footer.

So we need a solution that unsticks the footer on pages with little content, and just show it.

## Container queries to the rescue! Or not...

My first instinct was to reach for container queries. The idea: check if the `body` is taller than `calc(100vh + footer-size)`, and make the footer sticky only in that case. Something like this CSS snippet.

```css
body {
  container: content / size;
}

@container content (height > calc(100vh + 200px)) {
  footer {
    position: sticky;
  }
}
```

Now, I’m not exactly fluent in container queries, so I decided to break this down and test it in parts. First: does `100vh` even work inside a container query?

```css
h1 {
  display: none;
}

@container content (height < 100vh) {
  h1 {
    display: inline-block;
  }
}
```

And yep, the `<h1>` shows up. Great! Next test: does `calc()` break it? Replace `100vh` with `calc(100vh - 200px)`. Still works. Even better!

Fully confident, I tried my original idea. Result? Nothing. It didn’t work. Even worse, it broke my layout. How? Why? Whyyyyy?

## Where did it go wrong?

Turns out, it’s all about `container-type: size`. As soon as you give an element this property, it becomes a “block-size container” (thanks to [Nathan Knowler](https://sunny.garden/@knowler/114700150901598760) for letting me know). That means its height no longer depends on its children. In other words: it won’t grow taller than `100vh` unless you _explicitly_ tell it to.

But why did my test cases work then? Simple: user error. I wrote tests where the container query checked whether the height was _less than_ `100vh`. It was just quicker to get a visible result that way. Classic mistake.

Another reminder: _always create test scenarios that closely match your desired use case_.

## Checking for overflow

With container queries off the table, my next idea was to detect overflow. Check whether the page scrolls. And yes, [that’s possible](https://css-tip.com/overflow-detection/). There are a few ways to approach it. Sticking with container-style queries, it might look like this the CSS snippet below.

```css
@container style(--scroll: 1) {
  footer {
    position: sticky;
  }
}
```

It works—in the sense that it _does_ detect scroll. But it doesn’t solve the UX problem. Even when there’s only enough space to reveal _half_ the footer, this still counts as overflow. So `position: sticky` gets applied, and the half-visible footer is back.

What’s missing is a way to tell CSS: _hey, don’t include the footer in this calculation._

## The final(?) solution

JavaScript to the rescue. Old-school, but it works. I landed on a simple approach: check if the content (minus the footer) is taller than the viewport. If it is, that means the footer starts off-screen and should be sticky. So we set a `data-sticky` attribute on the footer—and target that in CSS.

```js
const footer = document.getElementById("site-footer");
const fHeight = footer.offsetHeight;
const dHeight = document.body.offsetHeight;

if (dHeight - fHeight > window.innerHeight) {
  footer.dataset.sticky = true;
}
```

```css
footer[data-sticky] {
  position: sticky;
}
```

## Wrapping up

And that’s it—an enhanced sticky revealing footer! A little sprinkle of JavaScript runs on page load, and the result feels smoother across all page lengths. And whenever JavaScript is not available, the footer is just attached at the end of the page. Nice little _progressive enhancement_.

Of course... if anyone figures out a pure CSS solution, I’m all ears. Hit me up!
