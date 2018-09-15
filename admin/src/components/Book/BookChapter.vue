<template>
	<div class="book_chapter">
		<!-- 当前章节的index -->
		<div class="basicInfo">
			<div class="current_index">
				当前章节: {{chapter_index}}
			</div>
			<el-button type="success" class="uploadBookChapter" @click="uploadBookChapter">提交</el-button>
			<el-button class="goback" @click="goback">返回上一页</el-button>
		</div>
		
		<!-- 填写内容 -->
		<div class="chapter_info">
			章节标题: <el-input v-model="chapter_title" placeholder="请输入内容"></el-input>
			<div class="splitModel"></div>
			<vue-editor v-model="content" @imageAdded="handleImageAdded"></vue-editor>
		</div>
	</div>
</template>

<script>
	import { VueEditor  } from 'vue2-editor'
	export default {
		components: {
			VueEditor
		},
		data() {
			return {
				bookId: 0,
				chapter_index: 0,
				chapterId: 0,
				chapter_title: '',
				content: '',
			};
		},
		created () {
			this.getId()
		},
		methods: {
			// 拿到当前书的id
			getId() {
				this.bookId = this.$route.query.bookid
				this.chapter_index = this.$route.query.currentIndex
				if (this.$route.query.chapterid) {
					this.chapterId = this.$route.query.chapterid
					this.$axios
						.get(`/chapter/${this.chapterId}`)
						.then(result => {
							this.chapter_title = result.data.title
							this.content = result.data.content
						})
				}
				if (!this.chapter_index) {
					this.$message({
						message: '请从图书详情页进入该页面来获取当前章节',
						type: 'warning'
					});
				}
			},
			// 提交该章节信息
			uploadBookChapter() {
				if (this.chapter_title === '' || this.content === '' || !this.chapter_index) {
					this.$message({
						message: '标题或内容不能为空, 请从图书详情页进入该页面来获取当前章节',
						type: 'warning'
					});
				}
				// 判断为新建还是编辑
				if (this.chapterId !== 0) {
					this.$axios
						.put(`/chapter/${this.chapterId}`, {
							title: this.chapter_title,
							content: this.content
						})
						.then(result => {
							this.$router.push({path: `/bookinfo/${this.bookId}`})
						})
				}else {
					this.$axios
						.post(`/book/${this.bookId}/chapter`, {
							title: this.chapter_title,
							index: this.chapter_index,
							content: this.content
						})
						.then(result => {
							this.$router.push({path: `/bookinfo/${this.bookId}`})
						})
				}
				
			},
			goback() {
				this.$router.push({path: `/bookinfo/${this.bookId}`})
			},
			// 富文本编辑器图片上传
			handleImageAdded() {
				// const formData = new FormData();
				// formData.append('image', file)
				// axios({
				// 		url: 'https://fakeapi.yoursite.com/images',
				// 		method: 'POST',
				// 		data: formData
				// 	})
				// 	.then((result) => {
				// 		let url = result.data.url // Get url from response
				// 		Editor.insertEmbed(cursorLocation, 'image', url);
				// 		resetUploader();
				// 	})
				// 	.catch((err) => {
				// 		console.log(err);
				// 	})
			},
		}
	}
</script>

<style lang="css" scoped>
.book_chapter {
	width: 100%;
}
.basicInfo {
	height: 50px;
}
.current_index {
	margin: 0 0 15px 0;
	float: left;
}
.uploadBookChapter {
	float: right;
}
.el-input {
	width: 30%;
}
.splitModel {
	padding: 15px;
}
.goback {
	float: right;
	margin: 0 15px;
}
</style>