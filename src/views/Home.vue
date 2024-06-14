<template>
  <div class="home">
    home
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {$totalTypePrice} from '../api/roomType.ts'
import * as echarts from 'echarts';

// 房型销售信息
let totalTypePrice = ref([])

const loadTotalTypePrice = async ()=>{
  let ret = await $totalTypePrice()
  totalTypePrice.value = ret
  showCharts()
  console.log(ret);
}

// 显示图表
const showCharts = ()=>{
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector('.home'));
  // 绘制图表
  myChart.setOption({
    title: {
      text: '房型销售额信息'
    },
    tooltip: {},
    xAxis: {
      data: totalTypePrice.value.map(r=>r.roomtypeName)
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: totalTypePrice.value.map(r=>r.totalMoney)
      }
    ]
  });
}

onMounted(()=>{
  loadTotalTypePrice()
})
</script>

<style lang="scss" scoped>
.home{
  width: 98%;
  height: calc(100vh - 80px);
}
</style>