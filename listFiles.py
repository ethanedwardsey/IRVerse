import os
modelList = os.listdir('./dist/exports/slides/transform')
pre_res = ['/exports/slides/transform/' + sub for sub in modelList]
print(pre_res)