import os
modelList = os.listdir('./dist/exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_NAV_MAP')
pre_res = [sub[:-4] + ".jpg" for sub in modelList]
print(pre_res)