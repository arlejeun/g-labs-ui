<template>
    <form>
        <label>{{ t('language') }}</label>
        <select v-model="locale">
            <option value="en">en</option>
            <option value="ja">ja</option>
        </select>
    </form>
    <p>{{ t('hello') }}</p>
    <form id="fruits">
        <label>{{ t('select') }}</label>
        <select v-model.number="select">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
    </form>
    <p>{{ t('fruits.banana', select, { n: select }) }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'local'
})
const select = ref(0)
  
</script>

<i18n>
{
  "en": {
    "language": "Language",
    "hello": "hello, world!"
  },
  "ja": {
    "language": "言語",
    "hello": "こんにちは、世界！"
  }
}
</i18n>