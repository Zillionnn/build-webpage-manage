<template>
  <div class="event-config">
    <div class="event-index">
      交互{{index}}
    </div>
    <div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'EventConfigBox',
  components: {},
  props: {
    info: {
      type: Object,
      required: true
    },
    index: {
      type: [String, Number],
      required: true,
      default: 0
    }
  },
  data () {
    return {}
  },
  methods: {

  }
}
</script>

<style scoped>
</style>
