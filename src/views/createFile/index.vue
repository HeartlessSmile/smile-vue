<template>
  <h1>生成文件配置</h1>
  <div class="page-content">
    <div class="left-page">
      <h5 style="margin: 8px 0px">生成搜索条件代码</h5>
      <div>
        <div style="margin: 8px 0">
          <el-button type="primary" @click="handelAdd('input')">添加input</el-button>
          <el-button type="primary" @click="handelAdd('select')">添加select</el-button>
          <el-button type="primary" @click="handelAdd('date')">添加date</el-button>
          <el-button type="danger" @click="clear('search')">清空</el-button>
        </div>
        <el-table :data="searchTableData" stripe style="width: 100%" :editable="true" border>
          <el-table-column label="数据类型" width="140" align="center">
            <template #default="scope">
              <el-select v-model="scope.row.type" class="m-2" @change="selectChange($event, scope.row)">
                <el-option label="下拉框" value="select" />
                <el-option label="搜索框" value="input" />
                <el-option label="日期" value="date" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="key名称" align="center" width="200">
            <template #default="scope">
              <el-input type="text" v-model.trim="scope.row.key" class="ipt" />
            </template>
          </el-table-column>
          <el-table-column label="label名称" width="200" align="center">
            <template #default="scope">
              <el-input type="text" v-model.trim="scope.row.label" class="ipt" />
            </template>
          </el-table-column>
          <el-table-column label="placeholder" width="200" align="center">
            <template #default="scope">
              <el-input type="text" v-model.trim="scope.row.placeholder" class="ipt" />
            </template>
          </el-table-column>

          <el-table-column label="额外配置区" align="center" minWidth="100">
            <template #default="scope">
              <template v-if="scope.row.type == 'select'">
                <el-checkbox v-model="scope.row.label_hh" label="label_hh" />
                <el-checkbox v-model="scope.row.clearable" label="clearable" />
                <el-checkbox v-model="scope.row.filterable" label="filterable" />
                <el-checkbox v-model="scope.row.multiple" label="multiple" />
              </template>
              <template v-if="scope.row.type == 'date'">
                <el-radio-group v-model="scope.row.dataType">
                  <el-radio
                    :label="item"
                    v-for="item in ['date', 'daterange', 'datetime', 'datetimerange', 'year', 'month']"
                    :key="item"
                    >{{ item }}</el-radio
                  >
                </el-radio-group>
                <br />
                <el-checkbox v-model="scope.row.label_hh" label="label_hh" />
                <el-checkbox v-model="scope.row.clearable" label="clearable" />
              </template>
              <template v-if="scope.row.type == 'input'">
                <el-checkbox v-model="scope.row.label_hh" label="label_hh" />
                <el-checkbox v-model="scope.row.clearable" label="clearable" />
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button @click="handelClick(scope.$index, scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-input
          type="textarea"
          style="width: 70%; margin-top: 16px; margin-right: 16px"
          v-model="moreSearchText"
        ></el-input>
        <el-button @click="addSearchMore">多个添加,隔开</el-button>
      </div>

      <el-divider />

      <div>
        <h5 style="margin: 30px 0px 8px">生成表格代码代码</h5>
        <el-checkbox v-model="isCheckBox" label="是否是多选表格" />
        <el-button type="primary" @click="addColumn" v-if="columnTableData.length == 0">添加</el-button>
        <el-button type="danger" @click="clear('column')">清空</el-button>
        <el-table :data="columnTableData" stripe style="width: 100%" :editable="true" border>
          <!-- <el-table-column label="" width="140" align="center">
          <template #default="scope"> </template>
        </el-table-column> -->
          <el-table-column label="title" align="center" minWidth="200">
            <template #default="scope">
              <el-input type="text" v-model.trim="scope.row.title" class="ipt" />
            </template>
          </el-table-column>
          <el-table-column label="key" minWidth="200" align="center">
            <template #default="scope">
              <el-input type="text" v-model.trim="scope.row.key" class="ipt" />
            </template>
          </el-table-column>
          <el-table-column label="width" width="150" align="center">
            <template #default="scope">
              <el-input type="text" v-model.trim="scope.row.width" class="ipt" />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button @click="addColumn(scope.$index, scope.row)" type="primary">添加</el-button>
              <el-button @click="delColumn(scope.$index, scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-input type="textarea" style="width: 70%; margin: 16px 16px 0 0" v-model="moreText"></el-input>
        <el-button @click="addColumnMore">多个添加,隔开</el-button>
      </div>
    </div>
    <div class="right-page">
      <el-button @click="copy('search')">复制search</el-button>
      <el-button @click="copy('column')">复制column</el-button>
      <div>
        <el-button @click="copy('all')" style="width: 100%" type="primary">复制全量</el-button>
      </div>
      <h5 style="margin: 8px 0px">搜索相关formValidate, condition, searchList</h5>

      {{ searchObj }}

      <h5 style="margin: 8px 0px">表格相关 columnsTable</h5>

      {{ columnsObj }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, getCurrentInstance } from 'vue'
const { appContext } = getCurrentInstance()

const searchTableData = ref([
  {
    type: 'select',
    key: '',
    label: '',
    placeholder: '',
    label_hh: false,
    clearable: true,
    filterable: true,
    multiple: false,
    dateType: 'date',
  },
])
const columnTableData = ref([{ id: 1 }])
const isCheckBox = ref(false)
const moreText = ref(' ')
const moreSearchText = ref('')
const word = ref('')
const handelAdd = (type) => {
  searchTableData.value.push({
    type,
    key: '',
    label: '',
    placeholder: '',
    label_hh: false,
    clearable: true,
    filterable: true,
    multiple: false,
    dateType: 'date',
  })
}
const handelClick = (index, row) => {
  searchTableData.value.splice(index, 1)
}
const searchObj = computed(() => {
  let formValidate = {}
  let condition = []
  let searchList = searchTableData.value.map((el, index) => {
    let { key, label, type, placeholder, label_hh, clearable, dateType, multiple } = el
    key = key || `search_${type}_${index}`
    placeholder = placeholder || type === 'input' ? '请输入' : '请选择'
    let obj = { type, key, label, placeholder, label_hh, clearable }

    formValidate[key] = ''
    let conditionObj = {
      f: key,
      t: 's',
      op: 'like',
    }
    if (type === 'select') {
      obj = { ...obj, multiple }
      if (multiple) {
        formValidate[key] = []
      }
      conditionObj.op = 'eq'
    } else if (type === 'date') {
      obj = { ...obj, dateType }
    }

    condition.push(conditionObj)

    return obj
  })

  return { formValidate, condition, searchList }
})

const columnsObj = computed(() => {
  let columnsTable = [...columnTableData.value]
  if (isCheckBox.value) {
    columnsTable.unshift({
      type: 'selection',
      width: '60',
      fixed: 'left',
      align: 'center',
    })
  }
  return { columnsTable }
})

const delColumn = (index, row) => {
  columnTableData.value.splice(index, 1)
}
const addColumn = (index, row) => {
  if (!index) {
    columnTableData.value.push({
      title: '',
      key: '',
      width: 150,
    })
  } else {
    columnTableData.value.splice(index + 1, 0, {
      title: '',
      key: '',
      width: 150,
    })
  }
}
const addColumnMore = () => {
  let str = moreText.value
    .split('\n')
    .filter((el) => el)
    .toString()
  const text = str.replaceAll('，', ',')
  moreText.value = text
  if (text) {
    let arr = text.split(',')
    arr = arr.map((el) => {
      return {
        title: el,
        key: '',
        width: 150,
      }
    })
    columnTableData.value.push(...arr)
  }
}

const addSearchMore = () => {
  let str = moreSearchText.value
    .split('\n')
    .filter((el) => el)
    .toString()
  const text = str.replaceAll('，', ',')
  moreSearchText.value = text
  if (text) {
    let arr = text.split(',')
    arr = arr.map((el) => {
      return {
        type: 'input',
        key: '',
        label: el,
        placeholder: '',
        label_hh: false,
        clearable: true,
        filterable: true,
        multiple: false,
        dateType: 'date',
      }
    })
    searchTableData.value.push(...arr)
  }
}

const clear = (type) => {
  if (type === 'search') {
    searchTableData.value = []
  } else {
    columnTableData.value = []
  }
}

const copy = async (type) => {
  if (type === 'search') {
    navigator.clipboard.writeText(JSON.stringify(searchObj.value))
  } else if (type === 'column') {
    navigator.clipboard.writeText(JSON.stringify(columnsObj.value.columnsTable))
  } else if (type === 'all') {
    let value = searchObj.value
    value.columnsTable = columnsObj.value.columnsTable
    navigator.clipboard.writeText(JSON.stringify(value))
  }

  ElMessage({ message: '复制成功', type: 'success' }, appContext)
}
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  height: calc(100vh - 150px);
  .left-page {
    height: 100%;
    padding: 10px;
    flex: 1;
    overflow: auto;
  }
  .right-page {
    width: 300px;
    height: 100%;
    padding: 10px;
    background-color: #f0f0f0;
  }
}
</style>
