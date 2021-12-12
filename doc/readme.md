# Приклад робочого процесу оброблення даних

## Схема взаємодії сервісів

![uml](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/wdc-molfar/workflow-example/main/doc/puml/workflow.puml)


## MSAPI-специфікація робочого процесу

```yaml
msapi: 1.0.1

metadata: 
    title: "@molfar Workflow"
    id: "@molfar/workflow/example"
    

workflow:
    
    - instance:
        of:
            path: ./services/scheduler.js
            name: scheduler
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                
                exchange:
                    name: scraper_tasks
                    mode: fanout
                        
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference 
    - instance:
        of:
            repo: https://github.com/wdc-molfar/service-tg-scraper.git
            path: ./.deployment/service-tg-scraper/service.js
            name: scraper    
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                
                queue:
                    name: scraper_tasks
                    exchange:
                        name: scraper_tasks
                        mode: fanout
                    options:
                        noAck: true    
                        
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string
            produce:
                
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                
                exchange:
                    name: scraped_messages
                    mode: fanout
                    options:
                        durable: true
                        persistent: true        
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string
                                
    - instance:
        of:
            repo: https://github.com/wdc-molfar/service-lang-detector.git
            path: ./.deployment/service-lang-detector/service.js
            
            name: lang-detector    
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                
                queue:
                    name: scraped_messages
                    exchange:
                        name: scraped_messages
                        mode: fanout
                        options:
                            durable: true
                            persistent: true
                    options:
                        noAck: false 
                        exclusive: false   
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                
                exchange:
                    name: "processed_messages"
                    mode: fanout
                    options:
                        durable: true
                        persistent: true
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

    - instance:
        of:
            repo: https://github.com/wdc-molfar/service-ner-uk.git
            path: ./.deployment/service-ner-uk/service.js
            
            name: ner-uk
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                queue:
                    name: processed_messages_uk
                    exchange:
                        name: processed_messages
                        mode: fanout
                        options:
                            durable: true
                            persistent: true
                    options:
                        noAck: false 
                        exclusive: false   
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                exchange:
                    name: "ner_messages"
                    mode: fanout
                    options:
                        durable: true
                        persistent: true
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

    - instance:
        of:
            repo: https://github.com/wdc-molfar/service-ner-ru.git
            path: ./.deployment/service-ner-ru/service.js
            
            name: ner-ru
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                queue:
                    name: processed_messages_ru
                    exchange:
                        name: processed_messages
                        mode: fanout
                        options:
                            durable: true
                            persistent: true
                    options:
                        noAck: false 
                        exclusive: false   
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                exchange:
                    name: "ner_messages"
                    mode: fanout
                    options:
                        durable: true
                        persistent: true
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string
                


    - instance:
        of:
            repo: https://github.com/wdc-molfar/service-ner-en.git
            path: ./.deployment/service-ner-en/service.js
            
            name: ner-en
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                queue:
                    name: processed_messages_en
                    exchange:
                        name: processed_messages
                        mode: fanout
                        options:
                            durable: true
                            persistent: true
                    options:
                        noAck: false 
                        exclusive: false   
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                exchange:
                    name: "ner_messages"
                    mode: fanout
                    options:
                        durable: true
                        persistent: true
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string

    - instance:
        of:
            repo: https://github.com/wdc-molfar/service-log.git
            path: ./.deployment/service-log/service.js
            
            name: log 
            config: 
                log: ./logs/ner_messages.log

            consume:
                amqp: 
                    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg
        
                queue:
                    name: ner_messages
                    exchange:
                        name: ner_messages
                        mode: fanout
                        options:
                            durable: true
                            persistent: true
                    options:
                        noAck: false 
                        exclusive: false   
                message:
                    type: object
                    required:
                        - type
                        - url
                    properties:
                        type:
                            type: string
                        url:
                            type: string
                            format: uri-reference
                        metadata:
                            type: object
                        createdAt:
                            type: string
                        md5:
                            type: string
       
            

```

## Клонування, інсталяція та запуск

```sh
    git clone https://github.com/wdc-molfar/workflow-example
    npm install
    npm run deploy
    npm run start
```

## Лог ```npm run deploy```

```sh

> @molfar/workflow-example@1.0.0 deploy D:\MOLFAR\2\workflow-example
> node deploy

[
  'https://github.com/wdc-molfar/service-tg-scraper.git',
  'https://github.com/wdc-molfar/service-lang-detector.git',
  'https://github.com/wdc-molfar/service-ner-uk.git',
  'https://github.com/wdc-molfar/service-ner-ru.git',
  'https://github.com/wdc-molfar/service-ner-en.git',
  'https://github.com/wdc-molfar/service-log.git'
]
added 61 packages from 50 contributors and audited 61 packages in 16.588s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Repo https://github.com/wdc-molfar/service-tg-scraper.git is deployed into D:\MOLFAR\2\workflow-example\.deployment\service-tg-scraper\service.js
added 41 packages from 34 contributors and audited 41 packages in 13.964s

2 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Repo https://github.com/wdc-molfar/service-lang-detector.git is deployed into D:\MOLFAR\2\workflow-example\.deployment\service-lang-detector\index.js

> @molfar/service-ner-uk@1.0.0 postinstall D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk
> node ./build/build

MOLFAR NER SERVICE POSTINSTALL
Install MITIE NER model for Ukrainian language
Create temp directory C:\Users\bolda\AppData\Local\Temp\MITIE-a2dffZ
Download https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part1
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part2
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part3
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part4
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/uk/uk_model.zip.sf-part5
Create model directory D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk\MITIE-models
Extract model into D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk\MITIE-models
file uk_model.dat extracted
Rename file D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk\MITIE-models\uk_model.dat to D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk\MITIE-models\model.dat
Remove temp C:\Users\bolda\AppData\Local\Temp\MITIE-a2dffZ
NER Model for Ukrainian language is installed into D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk\MITIE-models
Install MITIE package
Collecting git+https://github.com/mit-nlp/MITIE.git (from -r requirements.txt (line 1))
  Cloning https://github.com/mit-nlp/MITIE.git to c:\users\bolda\appdata\local\temp\pip-req-build-ozu19s9s
added 177 packages from 128 contributors and audited 177 packages in 133.636s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Repo https://github.com/wdc-molfar/service-ner-uk.git is deployed into D:\MOLFAR\2\workflow-example\.deployment\service-ner-uk\index.js

> @molfar/service-ner-ru@1.0.0 postinstall D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru
> node ./build/build

MOLFAR NER SERVICE POSTINSTALL
Install MITIE NER model for Russian language
Create temp directory C:\Users\bolda\AppData\Local\Temp\MITIE-HVp1oB
Download https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part1
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part2
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part3
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part4
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/ru/ru_model.zip.sf-part5
Create model directory D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru\MITIE-models
Extract model into D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru\MITIE-models
file ru_model.dat extracted
Rename file D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru\MITIE-models\ru_model.dat to D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru\MITIE-models\model.dat
Remove temp C:\Users\bolda\AppData\Local\Temp\MITIE-HVp1oB
NER Model for Russian language is installed into D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru\MITIE-models
Install MITIE package
Collecting git+https://github.com/mit-nlp/MITIE.git (from -r requirements.txt (line 1))
  Cloning https://github.com/mit-nlp/MITIE.git to c:\users\bolda\appdata\local\temp\pip-req-build-_990iwe3
added 180 packages from 128 contributors and audited 180 packages in 100.829s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Repo https://github.com/wdc-molfar/service-ner-ru.git is deployed into D:\MOLFAR\2\workflow-example\.deployment\service-ner-ru\index.js

> @molfar/service-ner-en@1.0.0 postinstall D:\MOLFAR\2\workflow-example\.deployment\service-ner-en
> node ./build/build

MOLFAR NER SERVICE POSTINSTALL
Install MITIE NER model for English language
Create temp directory C:\Users\bolda\AppData\Local\Temp\MITIE-IJBGIE
Download https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part1
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part2
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part3
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part4
https://raw.githubusercontent.com/boldak/MITIE-NER-models/main/en/en_model.zip.sf-part5
Create model directory D:\MOLFAR\2\workflow-example\.deployment\service-ner-en\MITIE-models
Extract model into D:\MOLFAR\2\workflow-example\.deployment\service-ner-en\MITIE-models
file en_model.dat extracted
Rename file D:\MOLFAR\2\workflow-example\.deployment\service-ner-en\MITIE-models\en_model.dat to D:\MOLFAR\2\workflow-example\.deployment\service-ner-en\MITIE-models\model.dat
Remove temp C:\Users\bolda\AppData\Local\Temp\MITIE-IJBGIE
NER Model for English language is installed into D:\MOLFAR\2\workflow-example\.deployment\service-ner-en\MITIE-models
Install MITIE package
Collecting git+https://github.com/mit-nlp/MITIE.git (from -r requirements.txt (line 1))
  Cloning https://github.com/mit-nlp/MITIE.git to c:\users\bolda\appdata\local\temp\pip-req-build-bzpa3nvx
added 177 packages from 128 contributors and audited 177 packages in 138.987s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Repo https://github.com/wdc-molfar/service-ner-en.git is deployed into D:\MOLFAR\2\workflow-example\.deployment\service-ner-en\index.js
added 43 packages from 40 contributors and audited 43 packages in 62.518s

2 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Repo https://github.com/wdc-molfar/service-log.git is deployed into D:\MOLFAR\2\workflow-example\.deployment\service-log\index.js

```

## Лог ```npm run start```

```sh
configure log
log > Open log ./logs/ner_messages.log
start log
configure ner-en
start ner-en
configure ner-ru
start ner-ru
configure ner-uk
start ner-uk
configure lang-detector
start lang-detector
configure scraper
start scraper
configure scheduler
start scheduler
scheduler > initiate 5 tasks
scraper > Fetch 20 messages from { type: 'telegram', url: 'https://t.me/s_hibo' }
scraper > Fetch 20 messages from { type: 'telegram', url: 'https://t.me/AllEconomics' }
scraper > Fetch 19 messages from { type: 'telegram', url: 'https://t.me/AK47pfl' }
scraper > Fetch 20 messages from { type: 'telegram', url: 'https://t.me/covid19_ukraine' }
scraper > Fetch 13 messages from { type: 'telegram', url: 'https://t.me/Baronova' }
lang-detector > detect locale  11f7105a13015556bde410186cc13e80 en
lang-detector > detect locale  c265696ff2161e27e0a7964d426a07e8 en
ner-ru ignore  11f7105a13015556bde410186cc13e80 en
ner-uk ignore  11f7105a13015556bde410186cc13e80 en
ner-en recognize  11f7105a13015556bde410186cc13e80 15 entities
lang-detector > detect locale  ee35ef1acfd82c876713f2afc0636919 en
ner-ru ignore  c265696ff2161e27e0a7964d426a07e8 en
ner-en recognize  c265696ff2161e27e0a7964d426a07e8 0 entities
ner-uk ignore  c265696ff2161e27e0a7964d426a07e8 en
lang-detector > detect locale  06a2108b23aec6dd59986c1b1e5671af en
ner-ru ignore  ee35ef1acfd82c876713f2afc0636919 en
ner-uk ignore  ee35ef1acfd82c876713f2afc0636919 en
lang-detector > detect locale  95e688fe17aa43bb57cf98f4dfa35890 en
ner-en recognize  ee35ef1acfd82c876713f2afc0636919 2 entities
ner-ru ignore  06a2108b23aec6dd59986c1b1e5671af en
ner-uk ignore  06a2108b23aec6dd59986c1b1e5671af en
lang-detector > detect locale  78be480f22174ca491b400dc24c906c0 en
ner-en recognize  06a2108b23aec6dd59986c1b1e5671af 3 entities
ner-ru ignore  95e688fe17aa43bb57cf98f4dfa35890 en
ner-uk ignore  95e688fe17aa43bb57cf98f4dfa35890 en
ner-en recognize  95e688fe17aa43bb57cf98f4dfa35890 1 entities
lang-detector > detect locale  466fb4b4a48cb47f6769e95e5db79043 en
ner-uk ignore  78be480f22174ca491b400dc24c906c0 en
ner-ru ignore  78be480f22174ca491b400dc24c906c0 en
ner-en recognize  78be480f22174ca491b400dc24c906c0 3 entities
lang-detector > detect locale  8c43822b2f25e5631ca2e948e690b08b en
ner-ru ignore  466fb4b4a48cb47f6769e95e5db79043 en
ner-uk ignore  466fb4b4a48cb47f6769e95e5db79043 en
ner-en recognize  466fb4b4a48cb47f6769e95e5db79043 3 entities
lang-detector > detect locale  37076aa478bf71052973e1f421e182b0 en
ner-ru ignore  8c43822b2f25e5631ca2e948e690b08b en
ner-uk ignore  8c43822b2f25e5631ca2e948e690b08b en
ner-en recognize  8c43822b2f25e5631ca2e948e690b08b 1 entities
lang-detector > detect locale  12b31cd272d89229da7d79c9d47b1c80 en
ner-ru ignore  37076aa478bf71052973e1f421e182b0 en
ner-uk ignore  37076aa478bf71052973e1f421e182b0 en
ner-en recognize  37076aa478bf71052973e1f421e182b0 1 entities
lang-detector > detect locale  47b903d957f4a3ab83c6f9de0de4ad14 en
ner-ru ignore  12b31cd272d89229da7d79c9d47b1c80 en
ner-uk ignore  12b31cd272d89229da7d79c9d47b1c80 en
ner-en recognize  12b31cd272d89229da7d79c9d47b1c80 4 entities
lang-detector > detect locale  0d6949a1918af9b10c805b68a14ad12a en
ner-uk ignore  47b903d957f4a3ab83c6f9de0de4ad14 en
ner-ru ignore  47b903d957f4a3ab83c6f9de0de4ad14 en
ner-en recognize  47b903d957f4a3ab83c6f9de0de4ad14 2 entities
lang-detector > detect locale  acd1df7be2984523698aaea637fa0e84 en
ner-uk ignore  0d6949a1918af9b10c805b68a14ad12a en
ner-ru ignore  0d6949a1918af9b10c805b68a14ad12a en
lang-detector > detect locale  9986d43f03a7e9b16be97b8b7b735112 en
ner-en recognize  0d6949a1918af9b10c805b68a14ad12a 1 entities
ner-ru ignore  acd1df7be2984523698aaea637fa0e84 en
lang-detector > detect locale  f9af8b16c95bb44e3fbd8bbdc588d392 en
ner-uk ignore  acd1df7be2984523698aaea637fa0e84 en
ner-en recognize  acd1df7be2984523698aaea637fa0e84 3 entities
ner-ru ignore  9986d43f03a7e9b16be97b8b7b735112 en
lang-detector > detect locale  7acc6fcb986d8915e008753d7920d6aa en
ner-uk ignore  9986d43f03a7e9b16be97b8b7b735112 en
ner-en recognize  9986d43f03a7e9b16be97b8b7b735112 0 entities
ner-ru ignore  f9af8b16c95bb44e3fbd8bbdc588d392 en
lang-detector > detect locale  1b185bdc15d74ea4486da48b2579d856 en
ner-uk ignore  f9af8b16c95bb44e3fbd8bbdc588d392 en
ner-en recognize  f9af8b16c95bb44e3fbd8bbdc588d392 1 entities
lang-detector > detect locale  0f8d32ee879101afea6d46065e49a3ab en
ner-ru ignore  7acc6fcb986d8915e008753d7920d6aa en
ner-uk ignore  7acc6fcb986d8915e008753d7920d6aa en
lang-detector > detect locale  281666edec0ba471842f6f589633b7e8 en
ner-ru ignore  1b185bdc15d74ea4486da48b2579d856 en
ner-uk ignore  1b185bdc15d74ea4486da48b2579d856 en
ner-en recognize  7acc6fcb986d8915e008753d7920d6aa 3 entities
lang-detector > detect locale  29681a607ea89182facf4445a81596f4 en
ner-ru ignore  0f8d32ee879101afea6d46065e49a3ab en
ner-uk ignore  0f8d32ee879101afea6d46065e49a3ab en
ner-en recognize  1b185bdc15d74ea4486da48b2579d856 1 entities
ner-ru ignore  281666edec0ba471842f6f589633b7e8 en
ner-uk ignore  281666edec0ba471842f6f589633b7e8 en
lang-detector > detect locale  e4f1ae13c6effeee34345bee812ddc66 ru
ner-en recognize  0f8d32ee879101afea6d46065e49a3ab 1 entities
ner-ru ignore  29681a607ea89182facf4445a81596f4 en
ner-uk ignore  29681a607ea89182facf4445a81596f4 en
lang-detector > detect locale  1298cc1a7c9a9c7f98916c2d5037e937 ru
ner-en recognize  281666edec0ba471842f6f589633b7e8 2 entities
ner-en recognize  29681a607ea89182facf4445a81596f4 4 entities
lang-detector > detect locale  2bf037bdb36be99f7c6d24666996c3fe ru
ner-uk ignore  e4f1ae13c6effeee34345bee812ddc66 ru
ner-ru recognize  e4f1ae13c6effeee34345bee812ddc66 3 entities
ner-en ignore  e4f1ae13c6effeee34345bee812ddc66 ru
ner-en ignore  1298cc1a7c9a9c7f98916c2d5037e937 ru
ner-uk ignore  1298cc1a7c9a9c7f98916c2d5037e937 ru
lang-detector > detect locale  bf2c26cacd16accd71c9152ded017654 ru
ner-ru recognize  1298cc1a7c9a9c7f98916c2d5037e937 2 entities
ner-en ignore  2bf037bdb36be99f7c6d24666996c3fe ru
ner-uk ignore  2bf037bdb36be99f7c6d24666996c3fe ru
ner-ru recognize  2bf037bdb36be99f7c6d24666996c3fe 2 entities
lang-detector > detect locale  8ea81d5b9d4121c76fc5cc8acb776648 ru
ner-en ignore  bf2c26cacd16accd71c9152ded017654 ru
ner-uk ignore  bf2c26cacd16accd71c9152ded017654 ru
ner-ru recognize  bf2c26cacd16accd71c9152ded017654 1 entities
lang-detector > detect locale  115dbe1455b7e253c91be8a3151b3de3 ru
ner-en ignore  8ea81d5b9d4121c76fc5cc8acb776648 ru
ner-uk ignore  8ea81d5b9d4121c76fc5cc8acb776648 ru
lang-detector > detect locale  a1e6f9c74e478891ed1cd2708fdf9b45 ru
ner-ru recognize  8ea81d5b9d4121c76fc5cc8acb776648 5 entities
ner-en ignore  115dbe1455b7e253c91be8a3151b3de3 ru
ner-uk ignore  115dbe1455b7e253c91be8a3151b3de3 ru
lang-detector > detect locale  dc08ab54840b57f5a8b1ec791addc3ed ru
ner-ru recognize  115dbe1455b7e253c91be8a3151b3de3 11 entities
ner-en ignore  a1e6f9c74e478891ed1cd2708fdf9b45 ru
ner-uk ignore  a1e6f9c74e478891ed1cd2708fdf9b45 ru
ner-ru recognize  a1e6f9c74e478891ed1cd2708fdf9b45 16 entities
lang-detector > detect locale  7f3fae7d8d47c54c30b1ee67e98ac60a ru
ner-en ignore  dc08ab54840b57f5a8b1ec791addc3ed ru
ner-uk ignore  dc08ab54840b57f5a8b1ec791addc3ed ru
ner-ru recognize  dc08ab54840b57f5a8b1ec791addc3ed 10 entities
lang-detector > detect locale  dadd3a89635057fff15556387ad825e5 ru
ner-en ignore  7f3fae7d8d47c54c30b1ee67e98ac60a ru
lang-detector > detect locale  3cf8c96d1a67a0827f1c7addf37e4c6d ru
ner-uk ignore  7f3fae7d8d47c54c30b1ee67e98ac60a ru
ner-ru recognize  7f3fae7d8d47c54c30b1ee67e98ac60a 15 entities
ner-en ignore  dadd3a89635057fff15556387ad825e5 ru
ner-uk ignore  dadd3a89635057fff15556387ad825e5 ru
ner-ru recognize  dadd3a89635057fff15556387ad825e5 6 entities
lang-detector > detect locale  adda3dd9fc06613ae22d8a7cbcc1087e ru
ner-en ignore  3cf8c96d1a67a0827f1c7addf37e4c6d ru
ner-uk ignore  3cf8c96d1a67a0827f1c7addf37e4c6d ru
lang-detector > detect locale  573bde99e247850c3012588263103737 ru
ner-ru recognize  3cf8c96d1a67a0827f1c7addf37e4c6d 12 entities
ner-en ignore  adda3dd9fc06613ae22d8a7cbcc1087e ru
ner-uk ignore  adda3dd9fc06613ae22d8a7cbcc1087e ru
ner-ru recognize  adda3dd9fc06613ae22d8a7cbcc1087e 15 entities
lang-detector > detect locale  b7faf8906bc4de523f0dc94197f484f9 ru
ner-en ignore  573bde99e247850c3012588263103737 ru
ner-uk ignore  573bde99e247850c3012588263103737 ru
ner-ru recognize  573bde99e247850c3012588263103737 3 entities
lang-detector > detect locale  89792c2e1ffb81bf09e9ae6d9be3e1fd ru
ner-en ignore  b7faf8906bc4de523f0dc94197f484f9 ru
ner-uk ignore  b7faf8906bc4de523f0dc94197f484f9 ru
lang-detector > detect locale  f5d31447b3ae05946e9ccde11800afa0 ru
ner-ru recognize  b7faf8906bc4de523f0dc94197f484f9 15 entities
ner-en ignore  89792c2e1ffb81bf09e9ae6d9be3e1fd ru
ner-uk ignore  89792c2e1ffb81bf09e9ae6d9be3e1fd ru
lang-detector > detect locale  a9b6129e0313742926d64f12cdea03ec ru
ner-ru recognize  89792c2e1ffb81bf09e9ae6d9be3e1fd 15 entities
ner-en ignore  f5d31447b3ae05946e9ccde11800afa0 ru
ner-uk ignore  f5d31447b3ae05946e9ccde11800afa0 ru
lang-detector > detect locale  96e96fd359f4218dc0d0cde015ffa37b ru
ner-ru recognize  f5d31447b3ae05946e9ccde11800afa0 8 entities
ner-en ignore  a9b6129e0313742926d64f12cdea03ec ru
ner-uk ignore  a9b6129e0313742926d64f12cdea03ec ru
lang-detector > detect locale  f39233a5917c8f6e6f8f8328ee25e8c4 ru
ner-ru recognize  a9b6129e0313742926d64f12cdea03ec 11 entities
ner-en ignore  96e96fd359f4218dc0d0cde015ffa37b ru
ner-uk ignore  96e96fd359f4218dc0d0cde015ffa37b ru
lang-detector > detect locale  df0f385319195ca0ca4b836766f2a95f ru
ner-ru recognize  96e96fd359f4218dc0d0cde015ffa37b 11 entities
ner-en ignore  f39233a5917c8f6e6f8f8328ee25e8c4 ru
ner-uk ignore  f39233a5917c8f6e6f8f8328ee25e8c4 ru
lang-detector > detect locale  b2c116ca073c9e7d8cd6c8cb5504ea54 ru
ner-ru recognize  f39233a5917c8f6e6f8f8328ee25e8c4 16 entities
ner-en ignore  df0f385319195ca0ca4b836766f2a95f ru
ner-uk ignore  df0f385319195ca0ca4b836766f2a95f ru
lang-detector > detect locale  e180d5240dce4b86789325326d55d4d0 ru
ner-ru recognize  df0f385319195ca0ca4b836766f2a95f 6 entities
ner-en ignore  b2c116ca073c9e7d8cd6c8cb5504ea54 ru
lang-detector > detect locale  e5ffac369e8b966549571acec67a6e28 ru
ner-uk ignore  b2c116ca073c9e7d8cd6c8cb5504ea54 ru
ner-ru recognize  b2c116ca073c9e7d8cd6c8cb5504ea54 12 entities
ner-en ignore  e180d5240dce4b86789325326d55d4d0 ru
ner-uk ignore  e180d5240dce4b86789325326d55d4d0 ru
lang-detector > detect locale  15f863e6630282be6aa974a55027edd7 ru
ner-en ignore  e5ffac369e8b966549571acec67a6e28 ru
lang-detector > detect locale  75834c86d8d97dd47ad3ef279d388664 ru
ner-uk ignore  e5ffac369e8b966549571acec67a6e28 ru
ner-ru recognize  e180d5240dce4b86789325326d55d4d0 9 entities
ner-en ignore  15f863e6630282be6aa974a55027edd7 ru
ner-uk ignore  15f863e6630282be6aa974a55027edd7 ru
lang-detector > detect locale  aef23425a5d5beb0dee933b326d58040 ru
ner-ru recognize  e5ffac369e8b966549571acec67a6e28 2 entities
ner-en ignore  75834c86d8d97dd47ad3ef279d388664 ru
ner-uk ignore  75834c86d8d97dd47ad3ef279d388664 ru
lang-detector > detect locale  5f046ee29dd72f8ce32c1b48969d35e7 ru
ner-en ignore  aef23425a5d5beb0dee933b326d58040 ru
ner-uk ignore  aef23425a5d5beb0dee933b326d58040 ru
lang-detector > detect locale  284e089c68e76dddc8b2e4c58e84ec99 ru
ner-ru recognize  15f863e6630282be6aa974a55027edd7 4 entities
ner-ru recognize  75834c86d8d97dd47ad3ef279d388664 4 entities
ner-ru recognize  aef23425a5d5beb0dee933b326d58040 0 entities
ner-en ignore  5f046ee29dd72f8ce32c1b48969d35e7 ru
ner-uk ignore  5f046ee29dd72f8ce32c1b48969d35e7 ru
lang-detector > detect locale  507da09e1f15a572e44189e3f4eef0f2 ru
ner-en ignore  284e089c68e76dddc8b2e4c58e84ec99 ru
ner-uk ignore  284e089c68e76dddc8b2e4c58e84ec99 ru
ner-ru recognize  5f046ee29dd72f8ce32c1b48969d35e7 48 entities
lang-detector > detect locale  545652328afe984be3037bea0a4e1a3a ru
ner-ru recognize  284e089c68e76dddc8b2e4c58e84ec99 5 entities
ner-en ignore  507da09e1f15a572e44189e3f4eef0f2 ru
ner-uk ignore  507da09e1f15a572e44189e3f4eef0f2 ru
lang-detector > detect locale  43167500bed38bd529c933e76b84732f ru
ner-en ignore  545652328afe984be3037bea0a4e1a3a ru
ner-uk ignore  545652328afe984be3037bea0a4e1a3a ru
lang-detector > detect locale  a294df8c4ee7e8ba8c2dd7cebe248ae8 ru
ner-en ignore  43167500bed38bd529c933e76b84732f ru
ner-uk ignore  43167500bed38bd529c933e76b84732f ru
lang-detector > detect locale  b0b086228ea42b5828b6173c033df9a7 ru
ner-en ignore  a294df8c4ee7e8ba8c2dd7cebe248ae8 ru
ner-uk ignore  a294df8c4ee7e8ba8c2dd7cebe248ae8 ru
lang-detector > detect locale  cd76b497f7e3ba329f1d9fee009d3363 ru
ner-ru recognize  507da09e1f15a572e44189e3f4eef0f2 19 entities
ner-ru recognize  545652328afe984be3037bea0a4e1a3a 2 entities
lang-detector > detect locale  3e0d18b8a9fd97350b5c00b87d76de63 ru
ner-en ignore  b0b086228ea42b5828b6173c033df9a7 ru
ner-uk ignore  b0b086228ea42b5828b6173c033df9a7 ru
ner-en ignore  cd76b497f7e3ba329f1d9fee009d3363 ru
ner-uk ignore  cd76b497f7e3ba329f1d9fee009d3363 ru
lang-detector > detect locale  e1e0afce5e52d8020b2c0d56c8fc3fa7 ru
ner-ru recognize  43167500bed38bd529c933e76b84732f 9 entities
ner-en ignore  3e0d18b8a9fd97350b5c00b87d76de63 ru
ner-uk ignore  3e0d18b8a9fd97350b5c00b87d76de63 ru
lang-detector > detect locale  3ebbd8219b4e0a8d65863c00a10de69f bg
ner-ru recognize  a294df8c4ee7e8ba8c2dd7cebe248ae8 0 entities
ner-en ignore  e1e0afce5e52d8020b2c0d56c8fc3fa7 ru
ner-uk ignore  e1e0afce5e52d8020b2c0d56c8fc3fa7 ru
lang-detector > detect locale  baf0c435a9962870c93c26c7b79b2e2a ru
ner-en ignore  3ebbd8219b4e0a8d65863c00a10de69f bg
ner-uk ignore  3ebbd8219b4e0a8d65863c00a10de69f bg
lang-detector > detect locale  1cc5b378b4c58e72e7a010c7444f790d ru
ner-ru recognize  b0b086228ea42b5828b6173c033df9a7 8 entities
ner-ru recognize  cd76b497f7e3ba329f1d9fee009d3363 5 entities
ner-en ignore  baf0c435a9962870c93c26c7b79b2e2a ru
ner-uk ignore  baf0c435a9962870c93c26c7b79b2e2a ru
lang-detector > detect locale  0e78dcd76e988f483272209334a2717c uk
ner-ru recognize  3e0d18b8a9fd97350b5c00b87d76de63 0 entities
ner-en ignore  1cc5b378b4c58e72e7a010c7444f790d ru
lang-detector > detect locale  a00f2aec5fad02f060cf6627722069f4 uk
ner-uk ignore  1cc5b378b4c58e72e7a010c7444f790d ru
ner-en ignore  0e78dcd76e988f483272209334a2717c uk
ner-ru recognize  e1e0afce5e52d8020b2c0d56c8fc3fa7 0 entities
lang-detector > detect locale  3af921846a8c3b966ddc9bd6ccf3a776 uk
ner-uk recognize  0e78dcd76e988f483272209334a2717c 6 entities
ner-ru ignore  3ebbd8219b4e0a8d65863c00a10de69f bg
ner-en ignore  a00f2aec5fad02f060cf6627722069f4 uk
ner-uk recognize  a00f2aec5fad02f060cf6627722069f4 1 entities
lang-detector > detect locale  4aabac0138f38c4d427ec6bf51406909 uk
ner-ru recognize  baf0c435a9962870c93c26c7b79b2e2a 7 entities
ner-en ignore  3af921846a8c3b966ddc9bd6ccf3a776 uk
lang-detector > detect locale  033edae49708a0a944a9924bdc693f66 uk
ner-uk recognize  3af921846a8c3b966ddc9bd6ccf3a776 12 entities
ner-ru recognize  1cc5b378b4c58e72e7a010c7444f790d 6 entities
ner-en ignore  4aabac0138f38c4d427ec6bf51406909 uk
lang-detector > detect locale  965f7ab521f2d00176765046e2e8139b uk
ner-uk recognize  4aabac0138f38c4d427ec6bf51406909 11 entities
ner-ru ignore  0e78dcd76e988f483272209334a2717c uk
lang-detector > detect locale  fcbc7d0f6fc1bd75c5352bfc53696a00 uk
ner-en ignore  033edae49708a0a944a9924bdc693f66 uk
ner-uk recognize  033edae49708a0a944a9924bdc693f66 16 entities
ner-ru ignore  a00f2aec5fad02f060cf6627722069f4 uk
ner-en ignore  965f7ab521f2d00176765046e2e8139b uk
lang-detector > detect locale  2d5818a6396aaf7b83c551134fb46004 uk
ner-uk recognize  965f7ab521f2d00176765046e2e8139b 2 entities
ner-ru ignore  3af921846a8c3b966ddc9bd6ccf3a776 uk
ner-en ignore  fcbc7d0f6fc1bd75c5352bfc53696a00 uk
lang-detector > detect locale  7c345fae8d8e5923980bf582173a7210 uk
ner-ru ignore  4aabac0138f38c4d427ec6bf51406909 uk
ner-ru ignore  033edae49708a0a944a9924bdc693f66 uk
ner-en ignore  2d5818a6396aaf7b83c551134fb46004 uk
lang-detector > detect locale  ad928e79d8871ca771a1e9c4690d0fe6 uk
ner-uk recognize  fcbc7d0f6fc1bd75c5352bfc53696a00 2 entities
ner-ru ignore  965f7ab521f2d00176765046e2e8139b uk
ner-ru ignore  fcbc7d0f6fc1bd75c5352bfc53696a00 uk
ner-uk recognize  2d5818a6396aaf7b83c551134fb46004 3 entities
ner-en ignore  7c345fae8d8e5923980bf582173a7210 uk
lang-detector > detect locale  52f23150ba4fd140424f34762988c8aa uk
ner-ru ignore  2d5818a6396aaf7b83c551134fb46004 uk
ner-uk recognize  7c345fae8d8e5923980bf582173a7210 13 entities
ner-ru ignore  7c345fae8d8e5923980bf582173a7210 uk
ner-en ignore  ad928e79d8871ca771a1e9c4690d0fe6 uk
lang-detector > detect locale  4e1f7b228c602cfd29428ec854898401 uk
ner-ru ignore  ad928e79d8871ca771a1e9c4690d0fe6 uk
ner-uk recognize  ad928e79d8871ca771a1e9c4690d0fe6 6 entities
ner-en ignore  52f23150ba4fd140424f34762988c8aa uk
lang-detector > detect locale  ed043091d21c1fd88aba9ef46e28de5d uk
ner-ru ignore  52f23150ba4fd140424f34762988c8aa uk
ner-uk recognize  52f23150ba4fd140424f34762988c8aa 13 entities
ner-en ignore  4e1f7b228c602cfd29428ec854898401 uk
lang-detector > detect locale  16b054ba7dc25073e73e11b4ec3f8e6f uk
ner-ru ignore  4e1f7b228c602cfd29428ec854898401 uk
ner-uk recognize  4e1f7b228c602cfd29428ec854898401 5 entities
ner-en ignore  ed043091d21c1fd88aba9ef46e28de5d uk
ner-ru ignore  ed043091d21c1fd88aba9ef46e28de5d uk
lang-detector > detect locale  cb88c971522417c01eef023a6452b679 uk
ner-en ignore  16b054ba7dc25073e73e11b4ec3f8e6f uk
ner-ru ignore  16b054ba7dc25073e73e11b4ec3f8e6f uk
lang-detector > detect locale  0c53cf67e6d6396a7d1e46d3605d99d1 uk
ner-uk recognize  ed043091d21c1fd88aba9ef46e28de5d 11 entities
ner-en ignore  cb88c971522417c01eef023a6452b679 uk
ner-ru ignore  cb88c971522417c01eef023a6452b679 uk
lang-detector > detect locale  c05cd8c14ff95d2c7fb6c4b9c1a05ed9 uk
ner-uk recognize  16b054ba7dc25073e73e11b4ec3f8e6f 5 entities
ner-en ignore  0c53cf67e6d6396a7d1e46d3605d99d1 uk
ner-ru ignore  0c53cf67e6d6396a7d1e46d3605d99d1 uk
lang-detector > detect locale  b0cf16ced3f5bfba0933f512a6c70be3 uk
ner-ru ignore  c05cd8c14ff95d2c7fb6c4b9c1a05ed9 uk
ner-en ignore  c05cd8c14ff95d2c7fb6c4b9c1a05ed9 uk
lang-detector > detect locale  14ff43298522ac6b0ec94a747d68b0e8 uk
ner-uk recognize  cb88c971522417c01eef023a6452b679 2 entities
ner-ru ignore  b0cf16ced3f5bfba0933f512a6c70be3 uk
ner-en ignore  b0cf16ced3f5bfba0933f512a6c70be3 uk
lang-detector > detect locale  b04e7c8ccc6e7b90c179f9dce820d39c uk
ner-uk recognize  0c53cf67e6d6396a7d1e46d3605d99d1 11 entities
ner-uk recognize  c05cd8c14ff95d2c7fb6c4b9c1a05ed9 6 entities
lang-detector > detect locale  d41d8cd98f00b204e9800998ecf8427e null
ner-en ignore  14ff43298522ac6b0ec94a747d68b0e8 uk
ner-ru ignore  14ff43298522ac6b0ec94a747d68b0e8 uk
ner-uk recognize  b0cf16ced3f5bfba0933f512a6c70be3 3 entities
ner-ru ignore  b04e7c8ccc6e7b90c179f9dce820d39c uk
ner-en ignore  b04e7c8ccc6e7b90c179f9dce820d39c uk
lang-detector > detect locale  a28f448fd92e1c85dc5395aedc8167ee ru
ner-uk recognize  14ff43298522ac6b0ec94a747d68b0e8 10 entities
ner-ru ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-en ignore  d41d8cd98f00b204e9800998ecf8427e null
lang-detector > detect locale  378a4e83f077e9109d00f4a5fe23b8ee ru
ner-uk recognize  b04e7c8ccc6e7b90c179f9dce820d39c 12 entities
ner-ru recognize  a28f448fd92e1c85dc5395aedc8167ee 2 entities
ner-en ignore  a28f448fd92e1c85dc5395aedc8167ee ru
lang-detector > detect locale  7e6d4cb0269a076ef398616241953a9d ru
ner-en ignore  378a4e83f077e9109d00f4a5fe23b8ee ru
ner-ru recognize  378a4e83f077e9109d00f4a5fe23b8ee 4 entities
lang-detector > detect locale  bd4da4699a21f04a782d87312c64289c ru
ner-uk ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-en ignore  7e6d4cb0269a076ef398616241953a9d ru
ner-ru recognize  7e6d4cb0269a076ef398616241953a9d 0 entities
lang-detector > detect locale  8520fd871c034bee6dbc6698c19c29d8 ru
ner-en ignore  bd4da4699a21f04a782d87312c64289c ru
lang-detector > detect locale  d41d8cd98f00b204e9800998ecf8427e null
ner-ru recognize  bd4da4699a21f04a782d87312c64289c 2 entities
ner-uk ignore  a28f448fd92e1c85dc5395aedc8167ee ru
ner-en ignore  8520fd871c034bee6dbc6698c19c29d8 ru
ner-ru recognize  8520fd871c034bee6dbc6698c19c29d8 2 entities
ner-uk ignore  378a4e83f077e9109d00f4a5fe23b8ee ru
lang-detector > detect locale  d41d8cd98f00b204e9800998ecf8427e null
ner-en ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-ru ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-uk ignore  7e6d4cb0269a076ef398616241953a9d ru
lang-detector > detect locale  b6df08906b5de9fc24df92352322d822 ru
ner-uk ignore  bd4da4699a21f04a782d87312c64289c ru
ner-ru ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-en ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-uk ignore  8520fd871c034bee6dbc6698c19c29d8 ru
lang-detector > detect locale  4ee1b1c8595bf093b9dc00bae039ccf9 ru
ner-en ignore  b6df08906b5de9fc24df92352322d822 ru
ner-ru recognize  b6df08906b5de9fc24df92352322d822 0 entities
ner-uk ignore  d41d8cd98f00b204e9800998ecf8427e null
lang-detector > detect locale  4a34bb36bfd92798fa8b017046411bb1 it
ner-uk ignore  d41d8cd98f00b204e9800998ecf8427e null
ner-uk ignore  b6df08906b5de9fc24df92352322d822 ru
lang-detector > detect locale  cb1d1bfea81fb9a15545a3d78b5c6be6 uk
ner-en ignore  4ee1b1c8595bf093b9dc00bae039ccf9 ru
ner-ru recognize  4ee1b1c8595bf093b9dc00bae039ccf9 0 entities
ner-en ignore  4a34bb36bfd92798fa8b017046411bb1 it
ner-ru ignore  4a34bb36bfd92798fa8b017046411bb1 it
ner-uk ignore  4ee1b1c8595bf093b9dc00bae039ccf9 ru
ner-uk ignore  4a34bb36bfd92798fa8b017046411bb1 it
ner-en ignore  cb1d1bfea81fb9a15545a3d78b5c6be6 uk
lang-detector > detect locale  bd70c117d273faba1419fd3b2328c65c ru
ner-ru ignore  cb1d1bfea81fb9a15545a3d78b5c6be6 uk
ner-uk recognize  cb1d1bfea81fb9a15545a3d78b5c6be6 0 entities
ner-en ignore  bd70c117d273faba1419fd3b2328c65c ru
ner-ru recognize  bd70c117d273faba1419fd3b2328c65c 0 entities
ner-uk ignore  bd70c117d273faba1419fd3b2328c65c ru

```
