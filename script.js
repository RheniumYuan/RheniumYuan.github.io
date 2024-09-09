let excelData = [];

// 页面加载时读取Excel文件
window.onload = function() {
    fetch('2023思政实践志愿服务时长表.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            let workbook = XLSX.read(data, { type: 'array' });
            let firstSheetName = workbook.SheetNames[0]; // 读取第一个表
            let worksheet = workbook.Sheets[firstSheetName];

            // 将表格数据解析为JSON格式
            excelData = XLSX.utils.sheet_to_json(worksheet);
        })
        .catch(error => {
            console.error("读取Excel文件失败: ", error);
        });
};

// 当点击查询按钮时，执行查询操作
document.getElementById("search-button").addEventListener("click", function() {
    let searchId = document.getElementById("search-id").value;
    let searchName = document.getElementById("search-name").value;
    let result = searchByIdAndName(searchId, searchName);
    displayResult(result);
});

// 根据学号和姓名查询数据
function searchByIdAndName(id, name) {
    return excelData.find(row => row.ID == id && row.Name === name);
}

// 将结果显示在页面上
function displayResult(result) {
    let resultDiv = document.getElementById("result");
    if (result) {
        resultDiv.innerHTML = JSON.stringify(result);
    } else {
        resultDiv.innerHTML = "未找到相应数据。";
    }
}
