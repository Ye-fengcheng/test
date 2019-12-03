<template>
<div>
    <div>
        <el-button icon="el-icon-plus" type="primary" size="mini">添加</el-button>       
        <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>   
    </div>
    <el-table
        :data="[{}]"
        style="width: 100%;"
        height="450"
        @row-dblclick="rowDbClick"
        highlight-current-row>
        <el-table-column
            type="index"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="productCode"
            label="区域审批状态"
            sortable
            width="150">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="省办审批状态"
            sortable
            width="150">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="客户ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="申请状态"
            sortable
            width="100">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="专卖店名称">
        </el-table-column>        
    </el-table>
    <div style="text-align: right;margin-top:15px;">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
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
        rowDbClick(row, event){
            this.$router.push({ path: '/frame/db/examineArea' });
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