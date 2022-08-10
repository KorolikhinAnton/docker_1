<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <VuetifyLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline justify-center">
          Add event
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newLine"
            counter
            maxlength="25"
            hint="Tab enter to add"
            label="Task"
            :loading="loading"
            @keyup.enter="addToList"
          />
          <v-timeline>
            <v-timeline>
              <v-timeline-item
                v-for="(item, index) in lines"
                :key="index"
                large
              >
                <template #opposite>
                  <span>{{ item }}</span>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',

  data () {
    return {
      newLine: null,
      lines: [],
      loading: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$axios.get('/getList').then((res) => {
        this.lines = res.data
      })
    },
    addToList () {
      if (!this.newLine) { return }
      this.loading = true
      this.$axios.post('/addToList', { newLine: this.newLine }).then((res) => {
        this.lines = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
