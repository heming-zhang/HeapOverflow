<template>
    <sui-container>
        <sui-form @submit="submit">
            <sui-form-field required>
                <label>Title</label>
                <input type="text" v-model="title">
            </sui-form-field>
            <sui-form-field required>
                <label>Description</label>
                <textarea class="summernote"></textarea>
            </sui-form-field>
            <sui-button type="submit" color="green">Submit</sui-button>
        </sui-form>
    </sui-container>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Post',
    data: () => {
        return {
            title: ''
        }
    },
    async created() {
        if(!this.$route.query || !this.$route.query.qid) return;
        const resp = await axios.get('http://3.14.88.210:31313/question', {
            params: {
                qid: this.$route.query.qid
            }
        });
        if(resp.data.err) {
            alert(resp.data.err);
            return;
        }
        this.title = resp.data.title;
        $('.summernote').summernote('code', resp.data.description);
    },
    mounted() {
        var config = {
            height: 350,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link']],
                ['view', ['fullscreen', 'codeview', 'help']],
            ]
        };
        $('.summernote').summernote(config);
    },
    methods: {
        submit: async function(e) {
            e.preventDefault();
            var new_id = null;
            if(this.$route.query.qid) {
                const resp = await axios.post('http://3.14.88.210:31313/upd_question', {
                    qid: this.$route.query.qid,
                    title: this.title,
                    description: $('.summernote').summernote('code')
                });
                if(resp.data.err) {
                    alert(resp.data.err);
                    return;
                }
                new_id = this.$route.query.qid;
            }
            else {
                const resp = await axios.post('http://3.14.88.210:31313/new_question', {
                    title: this.title,
                    description: $('.summernote').summernote('code')
                });
                if(resp.data.err) {
                    alert(resp.data.err);
                    return;
                }
                new_id = resp.data.id;
            }
            this.$router.push({path: '/question/' + new_id});
        }
    }
}
</script>

<style>

</style>