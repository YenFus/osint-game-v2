# Slack measured as local gradient: a flat fill of ANY colour has none, text and
# graphics have plenty. Row medians fail here because panels are two columns
# with different backgrounds, so a blank row reads as half-deviating.
from PIL import Image
import numpy as np, os, glob, sys
def bands(f):
    a=np.asarray(Image.open(f).convert('L')).astype(int)
    gx=np.abs(np.diff(a,axis=1)); gy=np.abs(np.diff(a,axis=0))
    g=np.zeros_like(a); g[:,:-1]+=gx; g[:-1,:]+=gy
    ink=(g>18).sum(axis=1)>14
    h=len(ink); best=0;bstart=0;cur=0
    for y in range(h):
        if not ink[y]:
            cur+=1
            if cur>best: best=cur;bstart=y-cur+1
        else: cur=0
    tail=h-(int(np.where(ink)[0][-1]) if ink.any() else 0)
    return h,best,bstart,tail
rows=[]
for f in sorted(glob.glob(sys.argv[1] if len(sys.argv)>1 else 'panels/*.png')):
    h,b,y,t=bands(f); rows.append((os.path.basename(f)[:-4],h,b,y,t,round(100*b/h)))
rows.sort(key=lambda r:-r[2])
print(f"{'shot':26}{'maxBand':>9}{'atY':>6}{'%panel':>8}")
for lead,h,b,y,t,pc in rows: print(f"{lead:26}{b:>9}{y:>6}{pc:>7}%"+("  <<<" if b>=170 else ""))
