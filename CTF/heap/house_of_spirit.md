

# house of spirit(L-CTF2016–pwn200)

### 前言

这个和 fastbin double free 很类似，不过 double free 直接修改了chunk指针的 fd 值，最后malloc 到fake chunk

而 house of spirt 是覆盖堆块指针，将其 free 掉，使 fake chunk 放入链表，然后malloc 出来。

不同点在于如何添加 fake chunk 到 fastbin 链表之中。

基本步骤

- 构造 fake chunk
- 覆盖堆指针指向 fake chunk
- free fake chunk,add to fastbin list
- malloc

最终目的：目标区域写任意值 。

构造fake chunk 需要遵循的约束直接参考 wiki

一般伪造还需要伪造下一个堆块的大小，因为free的时候有如下检查：

```c
 if (__builtin_expect (chunk_at_offset (p, size)->size <= 2 * SIZE_SZ, 0)
        || __builtin_expect (chunksize (chunk_at_offset (p, size))
                          >= av->system_mem, 0))                     
       {
        errstr = "free(): invalid next size (fast)";
        goto errout;
       }
```

## 题目分析

直接看题目 LCTF 2016 pwn200

题目链接：

<https://github.com/Winter3un/ctf_task/tree/master/LCTF2016/pwn200>



### 漏洞

- off-by-one

  接 print(%s) 所以可以输出栈上的地址

- 



### 利用思路

修改`0x400A29`函数的返回值地址为`shellcode`地址

我们需要：

- 泄露栈上的
- 修改指针
- free chunk

### 内存变化



这里要对函数栈帧变化很熟才行，主要是 rbp 和函数的返回地址。



### 参考链接

<https://aryb1n.github.io/2017/07/26/House-of-Spirit/>