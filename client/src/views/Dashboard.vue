<template>
    <a-row>
        <a-button id="addProduct" style="margin: 20px"  class="ant-btn-primary" @click="addProduct">Add Product</a-button>

        <a-table :columns="columns" :data-source="products">
            <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
        <add-product :display-prompt="displayPrompt" @closeModal="hideModal"/>
    </a-row>
</template>

<script>
    import AddProduct from "../components/AddProduct";
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            scopedSlots: { customRender: 'name' },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            ellipsis: true,
        },
        {
            title: 'Minimum Quantity',
            dataIndex: 'minimum_quantity',
            key: 'minimum_quantity',
            ellipsis: true,
        },
        {
            title: 'Discount Rate',
            dataIndex: 'discount_rate',
            key: 'discount_rate',
            ellipsis: true,
        },
    ];
    export default {
        name: 'DashboardPage',
        components: {
            AddProduct
        },
        data() {
            return {
                columns,
                displayPrompt: false,
                currentPage: 1,
                itemsPerPage: 10,
            }
        },
        computed: {
            products() {
                return this.$store.state.product.products;
            }
        },
        methods: {
            addProduct() {
                this.displayPrompt = true;
            },

            hideModal() {
                this.displayPrompt = false;
            },

        },
        created() {
            this.$store.dispatch("fetchProducts", {
                currentPage: this.currentPage,
                itemsPerPage: this.itemsPerPage
            });
        }
    }
</script>

<style scoped>

</style>