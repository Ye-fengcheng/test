<template>
<div>
    <div>
        <el-button icon="el-icon-plus" type="primary">添加</el-button>
        <el-button icon="el-icon-delete" type="danger">删除</el-button>
    </div>
    <el-table
        :data="tableData"
        style="width: 100%;"
        height="450"
        highlight-current-row
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            type="index"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            sortable
            width="350">
        </el-table-column>
        <el-table-column
            prop="num"
            label="浏览量"
            sortable
            width="100">
        </el-table-column>
        <el-table-column
            prop="status"
            label="审批状态"
            width="100">
        </el-table-column>
        <el-table-column
            prop="publicTime"
            label="创建时间"
            width="100"
            :formatter="formatter">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)">详情</el-button>
                <el-button
                    size="mini"          
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
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
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
            {
                title: '【专题】无鸡不成宴：挑选/处理/烹调/摆盘的一揽子解决方案，深度好文！',
                num: '10',
                status: '已审批',
                publicTime: '2018-1-24'
            },
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