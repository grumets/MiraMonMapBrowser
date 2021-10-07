# MiraMonMapBrowser

MiraMon Map Browser is based on OGC web services standards. To test it, you can set it up in your web server folder (for example, in Windows IIS, by downloading these files in C:\inetpub\wwwroot\MiraMonMapBrowser). The landing page of the browser is called index.htm. The code of the MiraMon Map Browser can be used with no modification.

The MiraMon Map Browser can be configured to your purposes populating a file named config.json document. Several examples of this document can be found in [the examples](src/examples) folder. You can request a Windows application called Adm_MMN.exe to edit some parts of config.json in a more user friendly way by sending a request to suport@miramon.uab.cat (although it does not allow to configure the recent functionalities).

The config.json file data model is described and can be validated using a [json schema file](src/config-schema.json)

It is also possible to load a config file with a different name by calling the landing page with the extra parameter index.htm?config={name-config-json}

## Evolution
* 2020/07/10, The configuration box allows to see and modify the config.json document in memory. This will be useful for testing and debugging.
* 2020/09/30, Capacity to connect to services that requires authentication was added with the support of the authenix server form [SecureDimensions](https://www.secure-dimensions.de/).

Commit descriptions provide information about other updates and corrections not listed here

## Attribution
The Miramon Map Browser is part of the MiraMon project managed by CREAF.

More information about this product can be found in the [MiraMon website](https://www.miramon.cat/USA/Prod-NavegadorServidor.htm#MiraMonMapBrowser) with some [examples of applications](https://www.miramon.cat/CAT/Servidors.htm)
