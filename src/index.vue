<template>
  <view class="container">
    <view class="header">
      <view class='header-title-wrap'>
        <text class='title'>todos</text>
      </view>
      <tabs :set-visibility="setVisibility" :visible="visibility"></tabs>
      <view class='textinput-wrap'>
        <text :class="{ 'textinput-wrap-icon': true, 'icon-all-done': allDone && todos.length }"
              @tap="allDone = !allDone">❯
        </text>
        <view class='textinput-wrap-input'>
          <input class="new-todo"
                 placeholder="记录你的待办任务"
                 v-model="newTodo"
                 @confirm="addTodo">
        </view>
      </view>
    </view>
    <view class="main" v-show="todos.length">
      <view class="todo-list">
        <view
            v-for="todo in filteredTodos"
            class="li"
            :key="todo._id"
        >
          <view :class="{ completed: todo.completed, editing: todo == editedTodo }">
            <view class="edit" v-if="todo == editedTodo">
              <input class="edit-todo" type="text"
                     v-model="todo.title"
                     v-todo-focus="todo == editedTodo"
                     @blur="doneEdit(todo)"
                     @confirm="doneEdit(todo)"
              >
            </view>
            <view v-else class='toggle'>
              <text
                  :class="{ label: true, checked: todo.completed }"
                  @tap="changeState(todo)"
              >
              </text>
              <todo-item
                  :todo="todo"
                  :edit="editTodo"
              />
              <text class='destroy' @tap="removeTodo(todo)"></text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer" v-show="todos.length">
      <text class="todo-count">
        <text class="strong">{{ remaining }}</text>
        个任务未完成
      </text>
      <view class="clear-completed" @tap="removeCompleted" v-show="todos.length > remaining" type="">
        清除已完成的任务
      </view>
    </view>
    <view class="info">
      <view class="p">双击来编辑任务</view>
      <view class="p">Inspired from
        <text class="a">ToDoMVC</text>
      </view>
    </view>
    <FabButton></FabButton>
  </view>
</template>

<script>
import TodoItem from './todo-item.vue'
import tabs from './components/tabs.vue'
import FabButton from "./components/FabButton.vue";
import './app.scss'
import Taro from "@tarojs/taro";

// modified from: https://vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = []
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    console.log('save to storage')
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

export default {
  components: {
    'FabButton': FabButton,
    'todo-item': TodoItem,
    'tabs': tabs
  },
  // app initial state
  data() {
    return {
      todos: [],
      newTodo: '',
      editedTodo: null,
      visibility: 'all',
      db: Taro.cloud.database(),
      openId: ''
    }
  },

  created() {
    this.getUserContext()
  },
  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value
        })
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.newTodo = ''
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      })
      // 将数据存储到云服务器中
      this.db.collection('tasks').add({
        data: {
          title: value,
          completed: false,
          createTime: this.db.serverDate()
        }
      }).then(res => {
        console.log(res)
      })
    },

    setVisibility: function (v) {
      this.visibility = v
    },

    removeTodo: function (todo) {
      wx.showModal({
        title: '删除任务',
        content: '确定删除该任务？',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            // console.log(this.todos[this.todos.indexOf(todo)]._id)
            let task_id = this.todos[this.todos.indexOf(todo)]._id
            this.todos.splice(this.todos.indexOf(todo), 1)
            this.db.collection('tasks').doc(task_id).remove()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
      // 更新数据库中的任务
      let task_id = this.todos[this.todos.indexOf(todo)]._id
      this.db.collection('tasks').doc(task_id).update({
        data:{
          title: todo.title
        }
      })
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.todos = filters.active(this.todos)
    },

    // 获取云服务器的数据
    getData: async function (openId) {
      const result = await this.db.collection('tasks').where({
        _openid: openId
      }).get()
      for (let i = 0; i < result.data.length; i++) {
        this.todos.push(result.data[i])
      }
      console.log(this.todos)
    },

    getUserContext: async function () {
      await Taro.cloud.callFunction({
        name: 'login',
        data: {},
      }).then(res => {
        this.openId = res.result['openid']
        this.getData(this.openId)
      })
    },

    changeState: function (todo) {
      todo.completed = !todo.completed
      // 更新数据库中的任务
      let task_id = this.todos[this.todos.indexOf(todo)]._id
      this.db.collection('tasks').doc(task_id).update({
        data:{
          completed: todo.completed
        }
      })
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
</script>
