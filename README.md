# bitsh

Bitcom Shell 

[What is Bitcom?](https://bitcom.bitdb.network)

![bitsh](./bitsh.png)

# 1. What?

bitsh is a shell interface that lets you "sign into" Bitcom, a virtual unix computer on Bitcoin.

The main use case for Bitcom currently is to manage and publish OP_RETURN based application protocols through the Bitcom decentralized directory.

Each account effectively represents an application protocol, and you can customize the home folder of your application protocol to globally publish the protocol to the decentralized Bitcom directory.

Learn more [here](https://bitcom.planaria.network).

# 2. Install

Install bitsh globally.

```
npm install -g bitsh
```

# 2. Usage

Run bitsh

```
bitsh
```

# 3. How is Bitsh related to Bitcom?

There is already an NPM package named [bitcom](https://bitcom.planaria.network/#/?id=install), which is a precursor of the bitsh module.

Both packages let you access Bitcom, but bitsh is much more powerful as it's not just a one-off command line application, but an entire shell interface you log into.

Think of the bitcom package as a one-off command line app like git, whereas bitsh is like Bash, but for Bitcom.

# 4. Key management

Bitsh is also a full fledged HD wallet. Bitsh creates a hidden folder named `.bitcom` under your home directory. This folder is used to maintain the generated extended private/public keys you can use to log into [Bitcom](https://bitcom.planaria.network) and publish your application protocols.

The folder structure looks like this:

```
~/.bitcom
  .seed
  /hd
    /0
      .bit
    /1
      .bit
    ..
  /wif
    /[Addr1]
      .bit
    /[Addr2]
      .bit
  ..
```

1. The `.bitcom` folder is automatically created in your home directory when you first launch bitsh
2. The `.bitcom` folder contains a single `.seed` file which contains the seed HD keys from which you will derive your real keys from.
3. The `.bitcom/hd` folder maintains the generated keys, incrementing the index every time you create a new key.
4. The `.bitcom/wif` folder maintains NON-HD keys you import. You can import external keys simply by running bitsh with `bitsh [WIF to import]`.


# 5. Commands

You can list the supported commands by typing in

```
help
```

Here are the currently supported commands:

## a. cat

You can either use `>` or `to` to import `bit://`, `b://`, `c://` URIs to a Bitcom local file

```
cat X > Y
```

is equivalent to

```
cat X to Y
```

## b. echo

You can assign string content to a Bitcom local file

```
echo "hello world" > description
```

is equivalent to 

```
echo "hello world" to description
```

## c. history

The history command lists all the Bitcom activities for the account.

```
history
```

Or you can run the command for another account:

```
history ~19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut
```

## d. ls

Display all Bitcom local file names

```
ls
```

or display all files for another account:

```
ls ~9HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut
```

## e. route

Enable or Add [bit:// routes](https://bit.planaria.network) to application protocols.

Learn more at [bit:// specification](https://bit.planaria.network).

## f. useradd

Register your account on Bitcom. This signals that your account is taken.

```
useradd
```

## g. whoami

Display current account information

```
whoami
```

