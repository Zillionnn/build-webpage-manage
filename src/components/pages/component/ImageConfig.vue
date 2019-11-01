<template>
  <div class="image-config">
    <div>
      <span>图片源:</span>
      <input :value="value" @input="changes($event.target.value)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageConfig',
  components: {},
  props: {
    value: {
      type: [String, Number, Object],
      required: false
    }
  },
  data () {
    return {}
  },
  methods: {
    changes (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>
</style>
