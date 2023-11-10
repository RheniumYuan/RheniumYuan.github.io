library(readxl)
data1 <- read_excel("E:/PkuerRhenium/大二上/实心实验/exp8_概率判断/data1.xlsx", sheet = 1)#原来的预处理数据
data2 <- read_excel("E:/PkuerRhenium/大二上/实心实验/exp8_概率判断/data1.xlsx", sheet = 2)#原始数据

data3 <- data1 #data3是重新计算的预处理数据
recalculate <- function(i,dataOld) {
  vec <- c(t(dataOld[i,4:15]))
  n0 <- sum(vec[7:12])
  n1 <- sum(vec[1:6])
  f1 <- sum(vec[1:6]*c(0.5,0.6,0.7,0.8,0.9,1.0))/sum(vec[1:6])
  f0 <- sum(vec[7:12]*c(0.5,0.6,0.7,0.8,0.9,1.0))/sum(vec[7:12])
  f <- sum(vec[1:6]*c(0.5,0.6,0.7,0.8,0.9,1.0)+vec[7:12]*c(0.5,0.6,0.7,0.8,0.9,1.0))/sum(data_vec[1:12])
  
  d <- sum(vec[1:6])/sum(vec[1:12])
  
  slope <- f1-f0
  bias <- f-d
  
  varf1 <- sum(vec[1:6]*(c(0.5,0.6,0.7,0.8,0.9,1.0)-f1)^2)/sum(vec[1:6])
  varf0 <- sum(vec[7:12]*(c(0.5,0.6,0.7,0.8,0.9,1.0)-f0)^2)/sum(vec[7:12])
  
  scatf <- (varf1*23+varf0*17)/sum(vec[1:12])
  PS <- sum((1-c(0.5,0.6,0.7,0.8,0.9,1.0))^2*vec[1:6],
            (0-c(0.5,0.6,0.7,0.8,0.9,1.0))^2*vec[7:12])/sum(vec[1:12])
  
  return(c(PS,bias,slope,scatf,f0,f1,f,d,n0,n1))
}

for (i in 1:nrow(data1)){
  a <- recalculate(i,data2)
  for (j in 4:13){
    data3[i,j] <- a[j-3] 
  }
}
