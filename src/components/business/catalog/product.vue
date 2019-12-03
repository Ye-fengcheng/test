<template>
<div>
    <div>
        <el-button icon="el-icon-delete" type="primary" size="mini"></el-button>
        <el-button icon="el-icon-upload2" type="primary" size="mini">导入</el-button>
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
            label="产品编号"
            sortable
            width="150">
        </el-table-column>
        <el-table-column
            prop="productName"
            label="产品名称"
            width="450">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                    size="mini"       
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
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