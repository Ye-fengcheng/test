<template>
<div>
    <div>
        <el-button icon="el-icon-plus" type="primary" @click="$router.push({ path: '/frame/user/createCustomerAccount' })" size="mini">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
        <el-button icon="el-icon-download" type="primary" size="mini">导出</el-button>
        
    </div>
    <el-table
        :data="tableData"
        style="width: 100%;"
        height="450"
        highlight-current-row>
        <el-table-column
            type="index"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="productCode"
            label="客户ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="区域"
            sortable
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="省办"
            sortable
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="客户余额"
            sortable
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="余额占用额度"
            sortable
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="信贷金额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="A折扣差可用额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="A折扣差占用额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="B折扣差可用额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="B折扣差占用额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="优惠券可用额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="优惠券占用额度"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="保证金"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="责任金"
            width="100">
        </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top:15px;">
        <el-pagination
            @size-change="handleSizeChange"
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
    </div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,
        tableData: [
        ]
      }
    },
    methods: {
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        formatter(row, column) {
        return row.publicTime;
        },
        handleEdit(index, row) {
        console.log(index, row);
        },
        handleDelete(index, row) {
        console.log(index, row);
        }
    }
  }
</script>