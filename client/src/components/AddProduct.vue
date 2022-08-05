<template>
    <a-modal v-model="activePrompt" title="Basic Modal" @ok="addProduct">
        <a-input id="name" placeholder="Name" v-model="name" />
        <a-input id="price" placeholder="Price" type="number" v-model="price" />
        <a-input id="quantity" placeholder="Minimum Quantity" type="number" v-model="minimum_quantity" />
        <a-input id="discount" placeholder="Discounted Rate" type="number" v-model="discount_rate" />
        <a-select id="category" style="width: 100%" @change="handleChange" v-model="category_id">
            <a-select-option :value="category.id" v-for="category in categories" :key="category.id">
                {{ category.name }}
            </a-select-option>
        </a-select>
        <a-input id="file" type="file" @change="handleChange($event)"/>
    </a-modal>
</template>

<script>
    export default {
        name: "ModalComponent",
        props: {
            displayPrompt: {
                type: Boolean,
                required: true
            },
        },
        data() {
            return {
                name: '',
                minimum_quantity: '',
                discount_rate: '',
                price: '',
                image: '',
                category_id: ''
            }
        },
        computed: {
            validateForm() {
                return !this.errors.any() && this.name !== "";
            },
            activePrompt: {
                get() {
                    return this.displayPrompt;
                },
                set(value) {
                    this.$emit("closeModal", value);
                }
            },
            categories() {
                return this.$store.state.product.categories;
            },
        },
        watch: {
            displayPrompt(val) {
                if (!val) return;
                // if (Object.entries(this.data).length === 0) {
                //     this.initValues();
                //     this.$validator.reset();
                // }
            }
        },
        created() {
            this.$store.dispatch("fetchCategories");
        },
        methods: {
            addProduct() {
                let formData = new FormData()
                formData.append('image', this.image)
                formData.append('name', this.name)
                formData.append('minimum_quantity', this.minimum_quantity)
                formData.append('discount_rate', this.discount_rate)
                formData.append('price', this.price)
                formData.append('category_id', this.category_id)
                this.$store
                    .dispatch("addProduct", formData)
                    .then(() => this.initRequest())
                    .catch(() => {});
            },
            handleChange(event) {
                this.image = event.target.files[0];
            },
            initRequest() {
                this.initValues()
                this.$emit("closeModal")
            },
            initValues() {
                this.name = "";
                this.price = "";
                this.category_id = "";
                this.minimum_quantity = "";
                this.image = "";
                this.discount_rate = "";
            }
        }
    }
</script>

<style scoped>

</style>