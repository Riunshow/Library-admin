<template>
  <div id="homepage_chart">
    <el-radio-group @change="getAllCount" v-model="days" style="margin-bottom: 30px;">
      <el-radio-button label="7">近 7 天</el-radio-button>
      <el-radio-button label="15">近 15 天</el-radio-button>
    </el-radio-group>
    <div class="people">
      <p>近 {{days}} 天管理统计</p>
      <ve-line :data="chartData" :settings="chartSettings"></ve-line>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      this.chartSettings = {
        stack: {
          // '统计': []
        },
        area: true
      }
      return {
        days: 7,
        chartData: {
          columns: ['日期', '用户统计', '社区文章统计', '图书统计', '图书分类统计', '章节更新统计'],
          rows: []
        },
        stage: {
          api_user_data: [],
          api_book_data: [],
          api_chapter_data: [],
					api_category_data: [],
					api_community_data: [],
        }


      };
    },
    created() {
      this.getAllCount()
    },
    methods: {
      getAllCount() {
        this.$axios
          .get(`/admin/manager?dateTime=${this.days}`)
          .then(result => {
            this.stage = {
							api_user_data: result.data.User.range,
							api_book_data: result.data.Book.range,
							api_chapter_data: result.data.Chapter.range,
							api_category_data: result.data.Category.range,
							api_community_data: result.data.Community.range,
						}
            this.getCurrentDay()
          })
      },
      getCurrentDay() {
        const setChartData = []
        let date = {
          month: '',
          day: ''
        }

        const oneDay = 24 * 60 * 60 * 1000

        for (let index = 0; index < this.days; index++) {
          const todayMS = new Date().getTime() - oneDay * index
          const today = new Date(todayMS)

          date.month = today.getMonth() + 1
          date.day = today.getDate()

          for (const key in this.stage) {
            if (this.stage.hasOwnProperty(key)) {

              if (!this.stage[key][index] || this.stage[key][index].dates != date.day) {
                const tmpData = {
                  date: date.day,
                  count: 0
                }
                this.stage[key].splice(index, 0, tmpData)
              }
            }
          }

          let dataTmp = {
            '日期': '',
            '用户统计': 0,
            '章节更新统计': 0,
            '图书统计': 0,
						'图书分类统计': 0,
						'社区文章统计': 0,						
          }

          for (const key in dataTmp) {
            if (dataTmp.hasOwnProperty(key)) {
              switch (key) {
                case '日期':
                  dataTmp[key] = `${date.month}-${date.day}`
                  break;
                case '用户统计':
                  dataTmp[key] = this.stage.api_user_data[index].count
                  break;
								case '章节更新统计':
									dataTmp[key] = this.stage.api_chapter_data[index].count
									break;
								case '图书统计':
									dataTmp[key] = this.stage.api_book_data[index].count
									break;
								case '图书分类统计':
									dataTmp[key] = this.stage.api_category_data[index].count
									break;
								case '社区文章统计':
									dataTmp[key] = this.stage.api_community_data[index].count
									break; 
              }
            }
          }
          setChartData.push(dataTmp)
        }
        this.chartData.rows = setChartData.reverse()

      },
      // 
    }
  }

</script>

<style lang="css" scoped>
  #homepage_chart {
    text-align: center;
    min-height: 450px;
  }

  .people {
    float: left;
    width: 100%;
    height: 100%;
  }

  .people p {
    margin-bottom: 15px;
    font-size: 20px;
    color: #48576a;
  }

</style>
