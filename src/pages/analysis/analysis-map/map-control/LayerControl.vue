<template>
  <div class="layer-control">
    <v-btn color="primary" class="layer-management-button" block :height="30">
      レイヤ管理
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "LayerControl"
};
</script>

<style lang="scss" scoped>
.layer-control {
  width: 135px;
}
</style>
