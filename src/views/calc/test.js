// import { parse } from "@vue/compiler-sfc";
import { baseParse } from "@vue/compiler-core";
const htmlStr = `<template>12<tag type="applet" class="custom-tag iop" custom-id="123">我们</tag><span>123</span></template>`
 const parseObj = baseParse(htmlStr)
 console.log(parseObj.children[0].children)