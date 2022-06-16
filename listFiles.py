import os
suffix = 'transformationtransition'
modelList = os.listdir('./dist/exports/slides/' + suffix)
pre_res = ['/exports/slides/' + suffix + '/' + sub for sub in modelList]
print(pre_res)