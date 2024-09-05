--- 
title: "R语言心理学网络分析应用"
author: "Rhenium Yuan"
date: "2024-09-05"
site: bookdown::bookdown_site
documentclass: book
bibliography: [book.bib, packages.bib]
# url: your book url like https://bookdown.org/yihui/bookdown
# cover-image: path to the social sharing image like images/cover.jpg
description: |
  This is a minimal example of using the bookdown package to write a book.
  The HTML output format for this example is bookdown::bs4_book,
  set in the _output.yml file.
biblio-style: apalike
csl: chicago-fullnote-bibliography.csl
---

# 引言

本教程简单介绍网络分析（network analysis）的一些基本方法及其在R语言中的应用。教程将首先从网络（network）或图（graph，和网络在这个教程中是一个意思）开始，简单介绍一些网络和图论的相关概念、心理学常用的网络分析方法（网络估计、网络的描述、网络分析的稳健性等）以及`igraph`、`qgraph`、`NetworkToolbox`等网络分析常用R包和相关操作。

网络分析是心理学和社会科学研究中的一种常见的方法。在网络分析中，各种变量（心理特质、症状、因素、社会个体等等）被视为网络中的结点（node或者vertex），这些结点之间的直接联系使用边（edge）来表示。通过分析由这些结点和边构成的网络，我们能够得到一些新的发现。例如，在临床心理学领域，心理障碍是往往由由症状之间的相互作用导致的，而网络分析可以帮助我们理解这个由症状形成的网络。

由于本人的研究领域关注临床心理学，因此本教程中的相关介绍也主要是在这一领域的研究中经常使用的方法，而一些其他研究领域中常用的网络分析方法（如社交网络）可能并不在介绍范围内。

在本教程中会使用如下的R包，在开始之前请提前安装。


```
#> 
#> Attaching package: 'igraph'
#> The following objects are masked from 'package:stats':
#> 
#>     decompose, spectrum
#> The following object is masked from 'package:base':
#> 
#>     union
#> Package: NetworkToolbox: Methods and Measures for Brain, Cognitive, and Psychometric
#> Network Analysis
#> Version: 1.4.2
#> Updated on: 2021-05-26
#> Maintainer: Alexander P. Christensen, University of North Carolina at Greensboro
#> Contributors: Guido Previde Massara, University College London
#>  For citation information, type citation("NetworkToolbox")
#>  For vignettes, see <https://doi.org/10.32614/RJ-2018-065> 
#>  For bugs and errors, submit an issue to <https://github.com/AlexChristensen/NetworkToolbox/issues>
#> 
#> Attaching package: 'NetworkToolbox'
#> The following object is masked from 'package:qgraph':
#> 
#>     smallworldness
#> The following objects are masked from 'package:igraph':
#> 
#>     betweenness, closeness, degree, diversity,
#>     strength, transitivity
#> Loading required package: ggplot2
#> This is bootnet 1.6
#> For questions and issues, please see github.com/SachaEpskamp/bootnet.
#> 
#> Attaching package: 'bootnet'
#> The following object is masked from 'package:NetworkToolbox':
#> 
#>     binarize
#> 
#> Attaching package: 'psych'
#> The following objects are masked from 'package:ggplot2':
#> 
#>     %+%, alpha
#> The following objects are masked from 'package:NetworkToolbox':
#> 
#>     cor2cov, distance
#> Loading required package: Rcpp
```

另外，本教程默认读者有一定R语言编程基础，在开始教程之前请先了解一下R语言的一些基础语法和分析操作。

关于心理学中的网络分析（特别是临床心理学领域）方法与进展，可以阅读以下的一些材料：

- 蔡玉清, 董书阳, 袁帅 &  胡传鹏. (2020). 变量间的网络分析模型及其应用. *心理科学进展*, (01), 178-195. https://doi.org/10.3724/SP.J.1042.2020.00178

- Borsboom, D., Deserno, M. K., Rhemtulla, M., Epskamp, S., Fried, E. I., McNally, R. J., Robinaugh, D. J., Perugini, M., Dalege, J., Costantini, G., Isvoranu, A.-M., Wysocki, A. C., van Borkulo, C. D., van Bork, R., & Waldorp, L. J. (2021). Network analysis of multivariate data in psychological science. *Nature Reviews Methods Primers*, *1*(1), 1–18. https://doi.org/10.1038/s43586-021-00055-w

- Borsboom, D., & Cramer, A. O. J. (2013). Network Analysis: An Integrative Approach to the Structure of Psychopathology. *Annual Review of Clinical Psychology*, *9*(1), 91–121. https://doi.org/10.1146/annurev-clinpsy-050212-185608

- Fried, E. I., van Borkulo, C. D., Cramer, A. O. J., Boschloo, L., Schoevers, R. A., & Borsboom, D. (2017). Mental disorders as networks of problems: A review of recent insights. *Social Psychiatry and Psychiatric Epidemiology*, *52*(1), 1–10. https://doi.org/10.1007/s00127-016-1319-z

- Isvoranu, A.-M., Epskamp, S., Waldorp, L., & Borsboom, D. (Eds.). (2022). Network Psychometrics with R: A Guide for Behavioral and Social Scientists (1st ed.). Routledge. https://doi.org/10.4324/9781003111238



