/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// Tests minfied + source maps.

async function foo() {
  return new Promise(r => setTimeout(r, 3000000));
}

function getScopeNodeLabel(dbg, index) {
  return findElement(dbg, "scopeNode", index).innerText;
}

function getScopeNodeValue(dbg, index) {
  return findElement(dbg, "scopeValue", index).innerText;
}

add_task(async function() {
  const dbg = await initDebugger("doc-minified2.html");

  await waitForSources(dbg, "sum.js");

  await selectSource(dbg, "sum.js");
  await addBreakpoint(dbg, "sum.js", 2);

  invokeInTab("test");
  await waitForPaused(dbg);
  await waitForMappedScopes(dbg);

  is(getScopeNodeLabel(dbg, 1), "sum");
  is(getScopeNodeLabel(dbg, 2), "<this>");
  is(getScopeNodeLabel(dbg, 3), "arguments");

  is(getScopeNodeLabel(dbg, 4), "first");
  is(getScopeNodeValue(dbg, 4), "40");
  is(getScopeNodeLabel(dbg, 5), "second");
  is(getScopeNodeValue(dbg, 5), "2");
});
