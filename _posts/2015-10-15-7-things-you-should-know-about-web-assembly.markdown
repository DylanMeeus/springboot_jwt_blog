---
layout: post
title: "7 Things You Should Know About WebAssembly"
description: "Learn about WebAssembly, the future of the web"
date: 2015-10-15 09:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#415156"
  image: https://cdn.auth0.com/blog/refresh-token/tokens.png
  image_size: "120%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags: 
- webassembly
- web assembly
- wasm
- wast
- asm.js
- nacl
- pnacl
- javascript
- emscripten
- llvm
---

In this post we will explore 7 key facts about *WebAssembly*, one of the biggest changes the web will experience in the coming years. Will it meet the expectations? Read on!

-----

## Introduction
If you are not familiar with the concepts behind compiled languages, the following might not make much sense. For a great introduction to some of the concepts discussed in this post, read this excellent [post by Peter Bright from ArsTechnica](http://arstechnica.com/information-technology/2015/06/the-web-is-getting-its-bytecode-webassembly/) or the [announcement post from Brendan Eich in his personal blog](https://brendaneich.com/2015/06/from-asm-js-to-webassembly/).

For the purposes of this post, here is a short glossary:

- **Source code:** what a developer writes.
- **Compiler:** an application that turns source code to assembly, bytecode or machine code (what other apps or hardware run).
- **Assembly:** a low-level source-like language specific to a machine or application.
- **Bytecode:** a low-level binary representation of code that can be run by other applications.
- **Machine code:** a binery representation of code that can be run directly by hardware.

WebAssembly aims to be the *bytecode* for the web. Here is how a developer would use WebAssembly in the future:

1. Develop an app (write the *source code* in any language that can be compiled to WebAssembly).
2. Use a *compiler* to turn the *source code* into WebAssembly *bytecode* (and potentially *assembly-code* if required).
3. Load the *bytecode* in a browser and run it.

## Fact 1: WebAssembly is not the end of JavaScript
It's been said before and it will be said again: **JavaScript is here to stay**. Thanks to the growth of the web, JavaScript has become a **lingua-franca** among developers and tool vendors. This will not change due to WebAssembly. WebAssembly is meant to fill a place JavaScript has been forced to occupy up to now: a **low-level code-representation to serve as a compiler target**. As more and more languages and platforms begin to target the web, more stress is put on JavaScript and browser vendors to provide missing features that are much needed. Some of these features **do not play well** with the already complex semantics of JavaScript. WebAssembly is the right answer:

- Designed as a compiler target from the get go
- Supported by all major browser vendors
- Potentially diverging from JavaScript semantics as much as needed

WebAssembly is the much needed **complement** to JavaScript for the web.

## Fact 2: Web Assembly is being developed by the teams behind asm.js and (P)NaCl
If you have been following the development of the web the last few years you know WebAssembly is aiming at a difficult goal: providing a unified compilation target for languages that do not map easily to JavaScript. Not only is it **difficult from a technical point of view**, but also **hard from a standards point of view**. The web is not controlled by any single vendor, so every change must be a **joint effort**. Fortunately, the teams behind WebAssembly know this. At Mozilla, a group of hardcore developers tried to provide an answer in the form of **asm.js**: a subset of JavaScript meant to serve as a compiler target. On the other side, Google worked on **Native Client (NaCl)** and **Portable Native Client (PNaCl)**, a binary format for the web based on LLVM. As much as these solutions worked, they **did not provide a satisfactory answer** to all of the problems. It is from this experience that Web Assembly was born: a **joint effort aiming at providing a cross-browser compiler target**. The future looks bright for WebAssembly.

## Fact 3: WebAssembly is backwards compatible
Backwards-compatibility is an essential feature of the web. WebAssembly will not be an exception: a **polyill** will be available for old-browsers. In fact, a prototype is [already available](https://github.com/WebAssembly/polyfill-prototype-1). You can see it working [here](http://lukewagner.github.io/AngryBotsPacked/) or [here](http://lukewagner.github.io/PlatformerGamePacked/).

## Fact 4: WebAssembly does not look like CPU assembly
When reading the word "assembly" you might immediately hear "unreadable" in your head. Fortunately, that is not the case for WebAssembly. In contrast to other low-level code representations, or most bytecodes, WebAssembly describes an **abstract syntax tree (AST)**. That's right, WebAssembly provides higher level constructs such as **loops and branches**. This means that it is actually possible to **write WebAssembly directly**, or decompile existing binary files to something that is much more readable than opcodes or instructions. You might be thinking "what about variable names?". WebAssembly will support adding **debugging information** to the compiled files.

This is a sample of what a text representation of WebAssembly might look like. This example uses s-expressions (a lightweight representation of ASTs):

```none
  ;; Iterative factorial named
  (func $fac-iter (param $n i64) (result i64)
    (local $i i64)
    (local $res i64)
    (set_local $i (get_local $n))
    (set_local $res (i64.const 1))
    (label $done
      (loop
        (if
          (i64.eq (get_local $i) (i64.const 0))
          (break $done)
          (block
            (set_local $res (i64.mul (get_local $i) (get_local $res)))
            (set_local $i (i64.sub (get_local $i) (i64.const 1)))
          )
        )
      )
    )
    (return (get_local $res))
  )
```

See the full example [here](https://github.com/WebAssembly/spec/blob/master/ml-proto/test/fac.wast).

Wait, are s-expressions the final format? No, no text representation has been officially adopted. Here is another example using a totally different syntax which you might find more familiar:

```none
export func main() i32 {
  storeI32(temp, 0);
  var i i32 = 0;
  done: while (i < 10) {
    i = i + 1;
    if (i >= 7) {
      break done;
    }
  }
  return (i + ifelse(0, 1, 2) * 2) * loadI32(temp) + loadI32(scale);
}
```

You can find this example [here](https://github.com/ncbray/wassembler/blob/master/demos/simple.wasm).

## Fact 5: WebAssembly will extend beyond the features required by JavaScript
The initial implementations of WebAssembly aim at **feature parity with asm.js**. In other words, what you can do today with asm.js, you will be able to do (better) with WebAssembly once it becomes available. One of the improvements you can expect in the initial versions are **better load times**. The binary format behind WebAssembly is much faster to parse than the text representation of asm.js. So even in its initial version, WebAssembly will result in improvements. This is what the current documents for WebAssembly call the [minimum viable product (MVP)](https://github.com/WebAssembly/design/blob/master/MVP.md). For future versions, some of the improvements we can expect are:

- Full threading support
- SIMD types and intrinsics
- Zero-cost exceptions (stack inspection and unwinding)
- Coroutines
- Dynamic linking
- DOM integration
- Integrated garbage collection
- Tail-call optimization
- Multi-process support

Some of these things would be really **hard to implement using JavaScript** or even plain asm.js. WebAssembly is being developed with these things in mind and will serve as a **great platform** for languages that support these (and other) features.

## Fact 6: Source-maps will allow you to easily debug compiled code in the browser
One of the downsides of a compiled target-language is debugging usually gets harder. If you have played with any language that currently translates to JavaScript, you might have experienced debugging hell when trying to mentally **map the resulting code to your original code**. WebAssembly aims to be a great platform for other languages, so they are already aiming at a solution for this. Much like current native compilers, WebAssembly will allow for **debugging information** in its binary format along with **source maps**. Source maps will tell browsers and debuggers how to map the generated code to its original source representation. **Easy debugging** is part of the WebAssembly spec.

## Fact 7: You do not need to wait for WebAssembly to be ready
As much as WebAssembly is still in its infancy, you can already reap many of benefits WebAssembly will provide in the future. As we have mentioned in fact 2, WebAssembly is the result of **years of experience** implementing asm.js and NaCl, and all of the benefits provided by these two implementations will be available in WebAssembly. If you want to reap these benefits right now, **asm.js is an excellent solution**. For instance, [Emscripten](https://github.com/kripken/emscripten) allows you to compile your code to asm.js *today*. If you think committing to asm.js today is a bad idea, keep in mind WebAssembly is still in its **infancy**. And even then, WebAssembly aims at feature parity with asm.js as its first goal. So don't be afraid to bet on asm.js. WebAssembly is being developed as an **upgrade path** from current solutions, so, even though it might be a good idea to start thinking of the future, in no way this means asm.js is not getting support today. Hack away!

## Aside: WebAssembly and existing libraries
At Auth0 we have a full body of work written in JavaScript. The cool thing about WebAssembly is that calls to JavaScript libraries (and viceversa) will be possible. So, for instance, you could make calls to the Auth0 JavaScript library directly from C++. How cool is that? For more on Auth0 (and our extensive use of JavaScript), <a href="javascript:signup()">signup and start hacking</a>.

## Conclusion
Along the last few years, we have seen an explosion of frameworks, compilers and other types of solutions that aim to take your existing code and make it *web-compatible*. This has caused a lot of **frustration in the community**. On one hand, features that do not fit well with JavaScript semantics or ideology have started showing up in implementors' forums and have raised **serious questions** among JavaScript developers. On the other hand, developers that want to use their existing code, or that want to use their favorite language or framework, have found themselves **locked out of the web**, or facing serious debugging challenges (among other problems). Even though existing solutions such as asm.js or PNaCl have done a lot to reduce these concerns, up to now there hasn't been a **proper, cross-vendor solution**. WebAssembly aims to solve that. A proper, cross-vendor, cross-language target for compilers, aiming at supporting all necessary features for making **a great all-around platform**. The stakes are high, but so are the rewards. And the people working on this know their stuff. The future is bright for WebAssembly.


