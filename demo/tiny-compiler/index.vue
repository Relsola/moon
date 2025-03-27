<template>
	<div>
		{{ compiler('(add 2 (subtract 4 2)) (add 2 (subtract 4 2))') }}
	</div>
</template>

<script setup>
import { tokenizer, parser, transformer, codeGenerator, compiler } from './the-super-tiny-compiler';
</script>
