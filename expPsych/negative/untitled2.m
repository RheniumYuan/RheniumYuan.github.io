% 假设你要处理的图像文件夹为inputFolder，保存结果的文件夹为outputFolder
inputFolder = ''; % 你可以修改为你的实际路径
outputFolder = 'E:\\PSYCH2023\\jsPsych2023\\experiment\\exp_v2\\图片\\实心大作业图片\\负性图片\\output'; % 你可以修改为你的实际路径

% 获取文件夹中的所有图像文件
imageFiles = dir(fullfile(inputFolder, '*.jpg')); % 假设你的图像格式为jpg，你可以根据需要修改
nfiles = length(imageFiles); % 获取文件的数量

% 循环处理每一个图像文件
for i = 1:nfiles
    % 获取当前文件的完整路径和文件名
    currentFile = fullfile(imageFiles(i).folder, imageFiles(i).name);
    
    % 读取图像数据
    image = imread(currentFile);
    
    % 裁剪图像为600*600的方形，假设图像的中心为裁剪的中心，你可以根据需要修改
    [height, width, ~] = size(image); % 获取图像的高度和宽度
    centerX = round(width / 2); % 计算图像的中心横坐标
    centerY = round(height / 2); % 计算图像的中心纵坐标
    rect = [centerX - 200, centerY - 200, 399, 399]; % 定义裁剪的矩形区域
    croppedImage = imcrop(image, rect); % 裁剪图像
    
    % 重命名图像文件，假设你要用数字序号来重命名，你可以根据需要修改
    newName = sprintf('Negative%03d.jpg', i); % 定义新的文件名
    newFile = fullfile(outputFolder, newName); % 定义新的文件路径
    
    % 保存裁剪后的图像
    imwrite(croppedImage, newFile);
end