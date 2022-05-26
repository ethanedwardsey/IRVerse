import os
modelList = os.listdir('./dist/exports/slides/blockchain')
pre_res = ['/exports/slides/blockchain/' + sub for sub in modelList]
print(pre_res)