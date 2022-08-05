import Vue from "vue";

export const notifyError = error => {
    Vue.$message.error(error.response.data.message);
};

export const notifySuccess = response => {
    Vue.$message.success(response.data.message);
};