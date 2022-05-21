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
            repo: https://github.com/wdc-molfar/service-sa-uk.git
            path: ./.deployment/service-sa-uk/service.js
            
            name: sentiment-analyzer-uk
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                queue:
                    name: sentiment_uk
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

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                exchange:
                    name: "sentiment"
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
            repo: https://github.com/wdc-molfar/service-sa-en.git
            path: ./.deployment/service-sa-en/service.js
            
            name: sentiment-analyzer-en
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                queue:
                    name: sentiment_en
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

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                exchange:
                    name: "sentiment"
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
            repo: https://github.com/wdc-molfar/service-sa-ru.git
            path: ./.deployment/service-sa-ru/service.js
            
            name: sentiment-analyzer-ru
            consume:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                queue:
                    name: sentiment_ru
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

                    
            produce:
                amqp:
                    url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
                exchange:
                    name: "sentiment"
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
                    name: sentiment_messages
                    exchange:
                        name: sentiment
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
2022-05-21 09:07:27 -> Start session
2022-05-21 09:07:56 -> {
 "type": "telegram",
 "url": "https://t.me/covid19_ukraine",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@covid19_ukraine",
   "title": "COVID19_Ukraine",
   "description": "<a href=\"https://t.me/lyosu\" target=\"_blank\">@lyosu</a>"
  },
  "html": "Канал доступний за посиланням:\n<a href=\"https://t.me/UkraineNow\" target=\"_blank\" rel=\"noopener\">https://t.me/UkraineNow</a>",
  "text": "Канал доступний за посиланням:\nhttps://t.me/UkraineNow",
  "publishedAt": "2022-02-26 10:56:32",
  "nlp": {
   "language": {
    "locale": "uk",
    "scores": [
     [
      "ukrainian",
      0.15254901960784306
     ],
     [
      "bulgarian",
      0.14235294117647057
     ],
     [
      "serbian",
      0.13745098039215686
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000100135803223,
     "__label__neg": 0.000010000127076637
    }
   }
  }
 },
 "md5": "71eb979e25a7c07ef9e40cd863b191b9",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:57 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<b>РДВ - первый аналитический бренд России.\n</b>Российские акции сегодня — это возможность увеличить свой капитал на 100-200% только на высокой недооценке.\nОДНАКО! Нужно понимать, что картина рынка поменялась: одни банки будут сменять другие, кто-то сможет экспортировать как раньше, а кто-то нет, кто-то не выдержит рост издержек и снижения доходов, а кто-то заберёт себе все труды проигравших и поэтому станет сильнее. Для того, чтобы знать больше других, нужны мы с вами - РДВ.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93A3.png')\"><b>📣</b></i> <b>Премиум доступ к знаниям РДВ:</b> <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09FA7A0.png')\"><b>🧠</b></i> <b>Партнёрский сайт для думающих инвесторов:</b> <a href=\"http://putinomics.ru/\" target=\"_blank\" rel=\"noopener\">putinomics.ru</a>\n\n<b><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F8F86.png')\"><b>🏆</b></i> РынкиДеньгиВласть:</b> <a href=\"http://t.me/AK47pfl\" target=\"_blank\" rel=\"noopener\">t.me/AK47pfl</a>\n\n<b><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F97A3.png')\"><b>🗣</b></i> Чат РДВ: </b><a href=\"http://t.me/AK47pflchat\" target=\"_blank\" rel=\"noopener\">http://t.me/AK47pflchat</a>",
  "text": "РДВ - первый аналитический бренд России.\nРоссийские акции сегодня   это возможность увеличить свой капитал на 100-200% только на высокой недооценке.\nОДНАКО! Нужно понимать, что картина рынка поменялась: одни банки будут сменять другие, кто-то сможет экспортировать как раньше, а кто-то нет, кто-то не выдержит рост издержек и снижения доходов, а кто-то заберёт себе все труды проигравших и поэтому станет сильнее. Для того, чтобы знать больше других, нужны мы с вами - РДВ.\n\n  Премиум доступ к знаниям РДВ: @RDVPREMIUMbot\n\n  Партнёрский сайт для думающих инвесторов: putinomics.ru\n\n  РынкиДеньгиВласть: t.me/AK47pfl\n\n  Чат РДВ: http://t.me/AK47pflchat",
  "publishedAt": "2022-05-18 05:00:43",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.24360000000000004
     ],
     [
      "bulgarian",
      0.1579666666666666
     ],
     [
      "macedonian",
      0.14252222222222222
     ]
    ]
   },
   "ner": [
    {
     "score": "1.063",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 5,
      "end": 5
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9999274015426636,
     "__label__neg": 0.00009254654287360609
    }
   }
  }
 },
 "md5": "a68fd237dd781f7e4b2634c88684a14e",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:58 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F87AAF09F87BA.png')\"><b>🇪🇺</b></i> <b>Газовые войны. Европа, похоже, хитрит:</b> <b>смягчила риторику в отношении российского газа, чтобы заполнить хранилища.</b>\n\nНа графике видно, что Европа ускорила закачку газовых хранилищ: их заполненность наконец-то вернулась к средним за 10 лет значениям. Закупки (несмотря на рекордные цены) ведутся в два раза быстрее, чем это нужно по плану.\n\n<u>Еще недавно Еврокомиссия считала оплату за газ в рублях неприемлемой.</u> «Оплата в рублях и открытие счета в Газпромбанке станут нарушением санкций и не могут быть приняты», — <a href=\"https://tass.ru/ekonomika/14535833\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">заявлял</a> еврокомиссар по вопросам энергетики. \n\n<u>Сегодня риторика изменилась.</u> 20 европейских покупателей <a href=\"https://t.me/cbrstocks/36437\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">завели счета</a> в Газпромбанке. «Никто никогда ничего не говорил про то, что платежи в рублях нарушают санкции», — <a href=\"https://www.bloomberg.com/news/articles/2022-05-17/eu-says-opening-ruble-accounts-for-russian-gas-breaks-sanctions\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">заявил</a> премьер-министр Италии.\n\nЕвропа может снова ужесточить риторику в отношении России после заполнения хранилищ. Газпром, в свою очередь, снижает поставки и замедляет процесс: <a href=\"https://t.me/AK47pfl/12107\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">транзит газа через Украину</a> в Европу снизился почти вдвое.\n\n<i>Газовые войны, похоже, продолжаются…</i>\n\n<a href=\"?q=%23GAZP\">#GAZP</a> \n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Газовые войны. Европа, похоже, хитрит: смягчила риторику в отношении российского газа, чтобы заполнить хранилища.\n\nНа графике видно, что Европа ускорила закачку газовых хранилищ: их заполненность наконец-то вернулась к средним за 10 лет значениям. Закупки (несмотря на рекордные цены) ведутся в два раза быстрее, чем это нужно по плану.\n\nЕще недавно Еврокомиссия считала оплату за газ в рублях неприемлемой. «Оплата в рублях и открытие счета в Газпромбанке станут нарушением санкций и не могут быть приняты»,   заявлял еврокомиссар по вопросам энергетики. \n\nСегодня риторика изменилась. 20 европейских покупателей завели счета в Газпромбанке. «Никто никогда ничего не говорил про то, что платежи в рублях нарушают санкции»,   заявил премьер-министр Италии.\n\nЕвропа может снова ужесточить риторику в отношении России после заполнения хранилищ. Газпром, в свою очередь, снижает поставки и замедляет процесс: транзит газа через Украину в Европу снизился почти вдвое.\n\nГазовые войны, похоже, продолжаются \n\n#GAZP \n@AK47pfl",
  "publishedAt": "2022-05-18 05:09:59",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.24080000000000001
     ],
     [
      "bulgarian",
      0.19304444444444446
     ],
     [
      "macedonian",
      0.15721111111111108
     ]
    ]
   },
   "ner": [
    {
     "score": "0.845",
     "tag": "LOC",
     "entity": "Европа",
     "range": {
      "start": 25,
      "end": 25
     }
    },
    {
     "score": "0.822",
     "tag": "ORG",
     "entity": "Еврокомиссия",
     "range": {
      "start": 63,
      "end": 63
     }
    },
    {
     "score": "0.698",
     "tag": "LOC",
     "entity": "рублях",
     "range": {
      "start": 74,
      "end": 74
     }
    },
    {
     "score": "0.434",
     "tag": "LOC",
     "entity": "Газпромбанке",
     "range": {
      "start": 79,
      "end": 79
     }
    },
    {
     "score": "0.081",
     "tag": "ORG",
     "entity": "еврокомиссар",
     "range": {
      "start": 90,
      "end": 90
     }
    },
    {
     "score": "0.203",
     "tag": "LOC",
     "entity": "Газпромбанке",
     "range": {
      "start": 105,
      "end": 105
     }
    },
    {
     "score": "0.844",
     "tag": "LOC",
     "entity": "рублях",
     "range": {
      "start": 118,
      "end": 118
     }
    },
    {
     "score": "1.220",
     "tag": "LOC",
     "entity": "Италии",
     "range": {
      "start": 124,
      "end": 124
     }
    },
    {
     "score": "1.499",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 133,
      "end": 133
     }
    },
    {
     "score": "0.859",
     "tag": "LOC",
     "entity": "Украину",
     "range": {
      "start": 153,
      "end": 153
     }
    },
    {
     "score": "0.776",
     "tag": "LOC",
     "entity": "Европу",
     "range": {
      "start": 155,
      "end": 155
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9992663264274597,
     "__label__pos": 0.0007536504999734461
    }
   }
  }
 },
 "md5": "d149d44d7e220d7f8ef29c5c6aff1463",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:58 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29A96.png')\"><b>⚖️</b></i> <b>Индикатор ЖиС Россия. 19.05.2022.</b>\n\nТекущее настроение: Страх.\n\n<b>Индикатор ЖиС помогает выбрать лучшие периоды для покупки и продажи акций.</b> Например, при экстремальной жадности на рынках (значение индекса выше 80 пунктов) лучше продавать активы, а не покупать их.\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9189.png')\"><b>👉</b></i> <a href=\"https://t.me/AK47pfl/5166\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Подробнее об индикаторе</a>.\n\n<a href=\"?q=%23morning\">#morning</a> <a href=\"?q=%23%D0%96%D0%B8%D0%A1\">#ЖиС</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Индикатор ЖиС Россия. 19.05.2022.\n\nТекущее настроение: Страх.\n\nИндикатор ЖиС помогает выбрать лучшие периоды для покупки и продажи акций. Например, при экстремальной жадности на рынках (значение индекса выше 80 пунктов) лучше продавать активы, а не покупать их.\n  Подробнее об индикаторе.\n\n#morning #ЖиС\n@AK47pfl",
  "publishedAt": "2022-05-19 08:00:00",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.1950786838340487
     ],
     [
      "bulgarian",
      0.16522174535050071
     ],
     [
      "macedonian",
      0.13459227467811163
     ]
    ]
   },
   "ner": [
    {
     "score": "0.935",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 2,
      "end": 2
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000070333480835,
     "__label__neg": 0.000012929283911944367
    }
   }
  }
 },
 "md5": "7e9eddf98c657814d584a8f44513e59a",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:58 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29880.png')\"><b>☀️</b></i> <b>19.05.2022</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F87B7F09F87BA.png')\"><b>🇷🇺</b></i> \n• Минэкономики спрогнозировало <a href=\"https://www.vedomosti.ru/business/articles/2022/05/19/922643-minekonomiki-eksportnih-tsen\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">падение экспортных цен</a> на нефть и газ к 2025 году.\n• Москва ведет переговоры с ООН о вывозе <a href=\"https://www.vedomosti.ru/economics/articles/2022/05/19/922632-moskva-vedet-peregovori-s-oon\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">зерна с Украины</a>.\n• Оборотные <a href=\"https://www.vedomosti.ru/technology/articles/2022/05/18/922625-oborotnie-shtrafi-utechku\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">штрафы за утечку</a> персональных данных могут составить 1% от выручки.\n• Сбер Еаптека будет <a href=\"https://www.vedomosti.ru/business/articles/2022/05/19/922640-sber-eapteka-badi\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">продавать БАДы</a> в том числе через отделения Сбербанка.\n• Матвиенко заявила о <a href=\"https://www.vedomosti.ru/politics/news/2022/05/19/922647-matvienko-nato\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">безопасности России</a> в случае расширения НАТО.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F8C8E.png')\"><b>🌎</b></i>\n• S&amp;P понизило <a href=\"https://www.interfax.ru/business/831691\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">прогноз по росту ВВП</a> в 2022 году для США с 3.2% до 2.4%, для Еврозоны с 3.3% до 2.7%, для Китая с 4.9% до 4.2%.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F87A8F09F87B3.png')\"><b>🇨🇳</b></i>\n• <a href=\"https://www.bloomberg.com/news/articles/2022-05-19/china-covid-cases-trending-down-but-lockdown-threat-remains?srnd=markets-vp\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Число заражений</a> Covid-19 в Китае снижаются, но угрозы блокировок остаются.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29D97.png')\"><b>❗️</b></i><b>Ожидается:</b>\n• Русал (<a href=\"https://putinomics.ru/dashboard/RUAL/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">RUAL</a>), НКНХ (<a href=\"https://putinomics.ru/dashboard/NKNC/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">NKNC</a>): СД обсудит дивиденды\n\n<a href=\"?q=%23morning\">#morning</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  19.05.2022\n\n  \n  Минэкономики спрогнозировало падение экспортных цен на нефть и газ к 2025 году.\n  Москва ведет переговоры с ООН о вывозе зерна с Украины.\n  Оборотные штрафы за утечку персональных данных могут составить 1% от выручки.\n  Сбер Еаптека будет продавать БАДы в том числе через отделения Сбербанка.\n  Матвиенко заявила о безопасности России в случае расширения НАТО.\n\n \n  S&P понизило прогноз по росту ВВП в 2022 году для США с 3.2% до 2.4%, для Еврозоны с 3.3% до 2.7%, для Китая с 4.9% до 4.2%.\n\n \n  Число заражений Covid-19 в Китае снижаются, но угрозы блокировок остаются.\n\n Ожидается:\n  Русал (RUAL), НКНХ (NKNC): СД обсудит дивиденды\n\n#morning\n@AK47pfl",
  "publishedAt": "2022-05-19 09:30:20",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.1970777777777778
     ],
     [
      "bulgarian",
      0.16010000000000002
     ],
     [
      "macedonian",
      0.15383333333333338
     ]
    ]
   },
   "ner": [
    {
     "score": "0.459",
     "tag": "ORG",
     "entity": "Минэкономики спрогнозировало",
     "range": {
      "start": 1,
      "end": 2
     }
    },
    {
     "score": "0.790",
     "tag": "LOC",
     "entity": "Москва",
     "range": {
      "start": 14,
      "end": 14
     }
    },
    {
     "score": "0.369",
     "tag": "ORG",
     "entity": "ООН",
     "range": {
      "start": 18,
      "end": 18
     }
    },
    {
     "score": "0.841",
     "tag": "LOC",
     "entity": "Украины",
     "range": {
      "start": 23,
      "end": 23
     }
    },
    {
     "score": "0.483",
     "tag": "ORG",
     "entity": "Еаптека",
     "range": {
      "start": 38,
      "end": 38
     }
    },
    {
     "score": "0.185",
     "tag": "ORG",
     "entity": "Сбербанка",
     "range": {
      "start": 47,
      "end": 47
     }
    },
    {
     "score": "1.206",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 53,
      "end": 53
     }
    },
    {
     "score": "0.829",
     "tag": "ORG",
     "entity": "НАТО",
     "range": {
      "start": 57,
      "end": 57
     }
    },
    {
     "score": "1.358",
     "tag": "LOC",
     "entity": "США",
     "range": {
      "start": 69,
      "end": 69
     }
    },
    {
     "score": "0.156",
     "tag": "ORG",
     "entity": "Еврозоны",
     "range": {
      "start": 76,
      "end": 76
     }
    },
    {
     "score": "1.115",
     "tag": "LOC",
     "entity": "Китая",
     "range": {
      "start": 83,
      "end": 83
     }
    },
    {
     "score": "0.870",
     "tag": "LOC",
     "entity": "Китае",
     "range": {
      "start": 93,
      "end": 93
     }
    },
    {
     "score": "0.673",
     "tag": "PERS",
     "entity": "Русал",
     "range": {
      "start": 103,
      "end": 103
     }
    },
    {
     "score": "0.514",
     "tag": "ORG",
     "entity": "RUAL",
     "range": {
      "start": 105,
      "end": 105
     }
    },
    {
     "score": "0.358",
     "tag": "ORG",
     "entity": "NKNC",
     "range": {
      "start": 110,
      "end": 110
     }
    },
    {
     "score": "0.154",
     "tag": "LOC",
     "entity": "СД",
     "range": {
      "start": 113,
      "end": 113
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9099482893943787,
     "__label__pos": 0.09007176011800766
    }
   }
  }
 },
 "md5": "ac724ffc5c315ed4d91da5da3dfafda1",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:58 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<a href=\"?q=%23ISKJ\">#ISKJ</a>\n<b><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29AA1.png')\"><b>⚡️</b></i> ИСКЧ, Ростех и Нацимбио заключили соглашение о создании комбинированной вакцины для профилактики коронавируса и гриппа </b>— ТАСС\n\nКлинические исследования начнутся во второй половине этого года, сообщили в Ростехе.",
  "text": "#ISKJ\n  ИСКЧ, Ростех и Нацимбио заключили соглашение о создании комбинированной вакцины для профилактики коронавируса и гриппа   ТАСС\n\nКлинические исследования начнутся во второй половине этого года, сообщили в Ростехе.",
  "publishedAt": "2022-05-19 10:56:18",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2330465949820788
     ],
     [
      "bulgarian",
      0.21587813620071683
     ],
     [
      "macedonian",
      0.16564516129032258
     ]
    ]
   },
   "ner": [
    {
     "score": "0.655",
     "tag": "ORG",
     "entity": "ИСКЧ",
     "range": {
      "start": 1,
      "end": 1
     }
    },
    {
     "score": "0.329",
     "tag": "LOC",
     "entity": "Ростех",
     "range": {
      "start": 3,
      "end": 3
     }
    },
    {
     "score": "1.303",
     "tag": "ORG",
     "entity": "ТАСС",
     "range": {
      "start": 17,
      "end": 17
     }
    },
    {
     "score": "0.505",
     "tag": "LOC",
     "entity": "Ростехе",
     "range": {
      "start": 29,
      "end": 29
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.994178056716919,
     "__label__neg": 0.005841902457177639
    }
   }
  }
 },
 "md5": "90a9487276bed424772f2e292796c495",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:58 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<b><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> ИСКЧ: рост выручки на 160% благодаря новым вакцинам?\n\n</b>ИСКЧ (<a href=\"https://putinomics.ru/dashboard/ISKJ/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">ISKJ</a>) и Ростех будут вместе <a href=\"https://t.me/AK47pfl/12169\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">разрабатывать</a> комбинированную вакцину против гриппа и коронавируса.\n\nПо официальной статистике, в России от гриппа прививается 50-70 млн человек в год. При стоимости вакцины 800 рублей размер рынка составляет 40-56 млрд рублей.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29D97.png')\"><b>❗️</b></i> Даже если вакцины ИСКЧ займут лишь 5% рынка, компания может заработать 2 млрд рублей.\n\n<b>Это может увеличить выручку компании на 160%:</b> за весь 2021 год ИСКЧ заработала 1.2 млрд рублей выручки.\n\n<a href=\"?q=%23ISKJ\">#ISKJ</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  ИСКЧ: рост выручки на 160% благодаря новым вакцинам?\n\nИСКЧ (ISKJ) и Ростех будут вместе разрабатывать комбинированную вакцину против гриппа и коронавируса.\n\nПо официальной статистике, в России от гриппа прививается 50-70 млн человек в год. При стоимости вакцины 800 рублей размер рынка составляет 40-56 млрд рублей.\n\n  Даже если вакцины ИСКЧ займут лишь 5% рынка, компания может заработать 2 млрд рублей.\n\nЭто может увеличить выручку компании на 160%: за весь 2021 год ИСКЧ заработала 1.2 млрд рублей выручки.\n\n#ISKJ\n@AK47pfl",
  "publishedAt": "2022-05-19 11:05:30",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.19567777777777784
     ],
     [
      "bulgarian",
      0.1529111111111111
     ],
     [
      "macedonian",
      0.13213333333333332
     ]
    ]
   },
   "ner": [
    {
     "score": "0.580",
     "tag": "ORG",
     "entity": "ИСКЧ",
     "range": {
      "start": 0,
      "end": 0
     }
    },
    {
     "score": "0.527",
     "tag": "ORG",
     "entity": "ISKJ",
     "range": {
      "start": 12,
      "end": 12
     }
    },
    {
     "score": "0.407",
     "tag": "LOC",
     "entity": "Ростех",
     "range": {
      "start": 15,
      "end": 15
     }
    },
    {
     "score": "1.624",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 31,
      "end": 31
     }
    },
    {
     "score": "0.777",
     "tag": "ORG",
     "entity": "компания",
     "range": {
      "start": 62,
      "end": 62
     }
    },
    {
     "score": "0.963",
     "tag": "ORG",
     "entity": "ИСКЧ",
     "range": {
      "start": 81,
      "end": 81
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.6815424561500549,
     "__label__neg": 0.3184775412082672
    }
   }
  }
 },
 "md5": "46d9f05de3dcc89c4b34f349554062c3",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:59 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> <b>Трансформация российской экономики.</b> <b>О чём говорит помощник президента</b> <b>РФ Орешкин.</b> Орешкин, похоже, предлагает балансировать <a href=\"https://t.me/AK47pfl/12160\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">два подхода в развитии</a>: и от старой экспортно-импортной модели не отказываться (разве что вместо Запада — Восток), и внутренний спрос простимулировать (но строго капиталистически). Процентная ставка будет снижаться (и, возможно, быстро), рубль ослабляться (хотя и не сразу).\n\n• Экономика РФ в 2022 году упадет гораздо меньше основных прогнозов, ВВП потеряет менее 5%;\n<i>Прогноз <a href=\"https://t.me/AK47pfl/12016\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">ЦБ</a>: </i>падение на <i>8-10%, <a href=\"https://t.me/AK47pfl/12159\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Минэк</a>: </i>падение на <i>7.8%\n\n</i>• Важный момент — необходимость восстановления рыночного кредитования. Банковская система находится в стрессе;\n<i>Орешкин, похоже, за существенно более низкую ставку. Снижение ставки, видимо, ускорится\n\n</i>• В ближайшие недели Россия выйдет на «устойчивый дефляционный тренд». Инфляция по итогам 2022 года не превысит 15%;\n<i>Прогноз ЦБ: 18-23%, Минэк: 17.5%</i>. <i>Раз дефляция, то можно смело снижать ставку</i>\n\n• Путин планирует провести госсовет по соцполитике, на нем будут приняты решения по индексации соцвыплат;\n<i>Одно из предложений в рамках второго пути <a href=\"https://t.me/AK47pfl/12160\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">трансформации экономики</a> — развитие внутреннего спроса. В дополнение ко льготной ипотеке</i>;<i>\n\n</i>• Мы будем строить экономику открытую к внешнему миру. Не будем закрываться, будем торговать и реализовывать инвестпроекты с партнёрами по всему миру. Экономика будет опираться на частную инициативу, основана на опережающем инфраструктурном развитии. Одно из самых важных — развитие будет технологически и экономически суверенным;\n\n• Главная причина глобального голода — необдуманные решения США и ЕС. Россия приняла меры еще в 2021 году.\n<i>На Россию и Украину <a href=\"https://www.worldstopexports.com/wheat-exports-country/\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">приходится</a> 25% мирового экспорта пшеницы\nВряд ли цель </i>— <i>продавить отмену западных санкций, но точно цель</i> —<i> не дать распространиться западным санкциям на остальных, голод должен перевесить санкционные страхи\n\n</i><a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Трансформация российской экономики. О чём говорит помощник президента РФ Орешкин. Орешкин, похоже, предлагает балансировать два подхода в развитии: и от старой экспортно-импортной модели не отказываться (разве что вместо Запада   Восток), и внутренний спрос простимулировать (но строго капиталистически). Процентная ставка будет снижаться (и, возможно, быстро), рубль ослабляться (хотя и не сразу).\n\n  Экономика РФ в 2022 году упадет гораздо меньше основных прогнозов, ВВП потеряет менее 5%;\nПрогноз ЦБ: падение на 8-10%, Минэк: падение на 7.8%\n\n  Важный момент   необходимость восстановления рыночного кредитования. Банковская система находится в стрессе;\nОрешкин, похоже, за существенно более низкую ставку. Снижение ставки, видимо, ускорится\n\n  В ближайшие недели Россия выйдет на «устойчивый дефляционный тренд». Инфляция по итогам 2022 года не превысит 15%;\nПрогноз ЦБ: 18-23%, Минэк: 17.5%. Раз дефляция, то можно смело снижать ставку\n\n  Путин планирует провести госсовет по соцполитике, на нем будут приняты решения по индексации соцвыплат;\nОдно из предложений в рамках второго пути трансформации экономики   развитие внутреннего спроса. В дополнение ко льготной ипотеке;\n\n  Мы будем строить экономику открытую к внешнему миру. Не будем закрываться, будем торговать и реализовывать инвестпроекты с партнёрами по всему миру. Экономика будет опираться на частную инициативу, основана на опережающем инфраструктурном развитии. Одно из самых важных   развитие будет технологически и экономически суверенным;\n\n  Главная причина глобального голода   необдуманные решения США и ЕС. Россия приняла меры еще в 2021 году.\nНа Россию и Украину приходится 25% мирового экспорта пшеницы\nВряд ли цель   продавить отмену западных санкций, но точно цель   не дать распространиться западным санкциям на остальных, голод должен перевесить санкционные страхи\n\n@AK47pfl",
  "publishedAt": "2022-05-19 02:55:02",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2983
     ],
     [
      "bulgarian",
      0.2384666666666666
     ],
     [
      "macedonian",
      0.21934444444444445
     ]
    ]
   },
   "ner": [
    {
     "score": "0.509",
     "tag": "LOC",
     "entity": "РФ Орешкин",
     "range": {
      "start": 9,
      "end": 10
     }
    },
    {
     "score": "0.673",
     "tag": "LOC",
     "entity": "Запада Восток",
     "range": {
      "start": 34,
      "end": 35
     }
    },
    {
     "score": "0.614",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 70,
      "end": 70
     }
    },
    {
     "score": "0.500",
     "tag": "PERS",
     "entity": "Минэк",
     "range": {
      "start": 91,
      "end": 91
     }
    },
    {
     "score": "0.814",
     "tag": "PERS",
     "entity": "Орешкин",
     "range": {
      "start": 108,
      "end": 108
     }
    },
    {
     "score": "0.955",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 127,
      "end": 127
     }
    },
    {
     "score": "0.576",
     "tag": "PERS",
     "entity": "Минэк",
     "range": {
      "start": 147,
      "end": 147
     }
    },
    {
     "score": "0.936",
     "tag": "PERS",
     "entity": "Путин",
     "range": {
      "start": 159,
      "end": 159
     }
    },
    {
     "score": "1.125",
     "tag": "LOC",
     "entity": "США",
     "range": {
      "start": 245,
      "end": 245
     }
    },
    {
     "score": "1.189",
     "tag": "ORG",
     "entity": "ЕС",
     "range": {
      "start": 247,
      "end": 247
     }
    },
    {
     "score": "0.991",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 249,
      "end": 249
     }
    },
    {
     "score": "1.101",
     "tag": "LOC",
     "entity": "Россию",
     "range": {
      "start": 258,
      "end": 258
     }
    },
    {
     "score": "0.949",
     "tag": "LOC",
     "entity": "Украину",
     "range": {
      "start": 260,
      "end": 260
     }
    },
    {
     "score": "0.352",
     "tag": "ORG",
     "entity": "голод",
     "range": {
      "start": 285,
      "end": 285
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9859026074409485,
     "__label__neg": 0.01411743089556694
    }
   }
  }
 },
 "md5": "40fd2f2d01162128cbc469119b6ccac6",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:59 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29AA1.png')\"><b>⚡️</b></i> <b>Кому Россия экспортировала</b> <b>природный газ</b> <b>— <a href=\"https://t.me/tass_agency/135351\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">ТАСС</a></b>\n\nВ 2021 году Россия экспортировала 204.4 млрд куб. м природного газа. Из них:\n+ В дружественные страны — 72 млрд куб. м.\n+ В недружественные страны, согласившиеся на новую схему оплаты за газ — 95 млрд куб. м\n- В страны, отказавшиеся от новой схемы оплаты — 30.4 млрд куб. м\n- В страны, ещё рассматривающие новую схему оплаты за газ — 7 млрд куб. м\n\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Кому Россия экспортировала природный газ   ТАСС\n\nВ 2021 году Россия экспортировала 204.4 млрд куб. м природного газа. Из них:\n+ В дружественные страны   72 млрд куб. м.\n+ В недружественные страны, согласившиеся на новую схему оплаты за газ   95 млрд куб. м\n- В страны, отказавшиеся от новой схемы оплаты   30.4 млрд куб. м\n- В страны, ещё рассматривающие новую схему оплаты за газ   7 млрд куб. м\n\n@AK47pfl",
  "publishedAt": "2022-05-19 03:41:53",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.20433333333333337
     ],
     [
      "ukrainian",
      0.1408571428571429
     ],
     [
      "bulgarian",
      0.13001587301587303
     ]
    ]
   },
   "ner": [
    {
     "score": "1.035",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 1,
      "end": 1
     }
    },
    {
     "score": "1.404",
     "tag": "ORG",
     "entity": "ТАСС",
     "range": {
      "start": 5,
      "end": 5
     }
    },
    {
     "score": "0.819",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 9,
      "end": 9
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9803900718688965,
     "__label__neg": 0.019630027934908867
    }
   }
  }
 },
 "md5": "8a7185a07e814d1cc20c75a689564f8d",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:59 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i><b> Минэкономразвития РФ <a href=\"https://www.economy.gov.ru/material/file/c56d9cd0365715292055fe5930854d59/scenarnye_usloviya_2023.pdf\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">прогнозирует</a> снижение цен на нефть и газ. Значительно упадёт экспорт газа и нефтепродуктов.\n\n</b><u>Газ</u>\n\nСредняя экспортная цена:\n• январь 2021г. — $182 за 1 тыс. куб. м\n• январь 2022г. — $877 за 1 тыс. куб. м\n• 2022г. — $513-523 за 1 тыс. куб. м\n• 2025г. — $311-336 за 1 тыс. куб. м\n\nДобыча:\n• 2021г. — 762 млрд куб. м\n• 2022г. — 721 млрд куб. м\n• 2025г. — 735 млрд куб. м\n\nЭкспорт:\n• 2021г. — 205 млрд куб. м \n• 2022г. — 185 млрд куб. м\n• 2025г. — 155.3 млрд куб. м\n\n<u>Нефть</u>\n\nСреднегодовая цена на нефть марки Urals:\n• 2021г. — $69/барр.\n• 2022г. — $80/барр.\n• 2025г. — $61/барр.\n\nДобыча:\n• 2021г. — 524 млн тонн\n• 2022г. — 475 млн тонн\n• 2025г. — 473 млн тонн\n\nЭкспорт:\n• 2021г. — 230 млн тонн\n• 2022г. — 228 млн тонн\n• 2025г. — 229 млн тонн\n\n<u>Экспорт нефтепродуктов:</u>\n• 2021г. — 144 млн тонн\n• 2022г. — 115 млн тонн\n• 2025г. — 123 млн тонн\n\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Минэкономразвития РФ прогнозирует снижение цен на нефть и газ. Значительно упадёт экспорт газа и нефтепродуктов.\n\nГаз\n\nСредняя экспортная цена:\n  январь 2021г.   $182 за 1 тыс. куб. м\n  январь 2022г.   $877 за 1 тыс. куб. м\n  2022г.   $513-523 за 1 тыс. куб. м\n  2025г.   $311-336 за 1 тыс. куб. м\n\nДобыча:\n  2021г.   762 млрд куб. м\n  2022г.   721 млрд куб. м\n  2025г.   735 млрд куб. м\n\nЭкспорт:\n  2021г.   205 млрд куб. м \n  2022г.   185 млрд куб. м\n  2025г.   155.3 млрд куб. м\n\nНефть\n\nСреднегодовая цена на нефть марки Urals:\n  2021г.   $69/барр.\n  2022г.   $80/барр.\n  2025г.   $61/барр.\n\nДобыча:\n  2021г.   524 млн тонн\n  2022г.   475 млн тонн\n  2025г.   473 млн тонн\n\nЭкспорт:\n  2021г.   230 млн тонн\n  2022г.   228 млн тонн\n  2025г.   229 млн тонн\n\nЭкспорт нефтепродуктов:\n  2021г.   144 млн тонн\n  2022г.   115 млн тонн\n  2025г.   123 млн тонн\n\n@AK47pfl",
  "publishedAt": "2022-05-19 04:26:27",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.09238888888888885
     ],
     [
      "bulgarian",
      0.08120000000000005
     ],
     [
      "macedonian",
      0.07003333333333328
     ]
    ]
   },
   "ner": [
    {
     "score": "0.743",
     "tag": "ORG",
     "entity": "Минэкономразвития РФ",
     "range": {
      "start": 0,
      "end": 1
     }
    },
    {
     "score": "0.576",
     "tag": "LOC",
     "entity": "Газ Средняя",
     "range": {
      "start": 17,
      "end": 18
     }
    },
    {
     "score": "0.339",
     "tag": "ORG",
     "entity": "Urals",
     "range": {
      "start": 116,
      "end": 116
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.999562680721283,
     "__label__neg": 0.000457287416793406
    }
   }
  }
 },
 "md5": "90427d81fa5a1a99ed88239dc084f13f",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:07:59 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29A96.png')\"><b>⚖️</b></i> <b>Индикатор ЖиС Россия. 20.05.2022.</b>\n\nТекущее настроение: Страх.\n\n<b>Индикатор ЖиС помогает выбрать лучшие периоды для покупки и продажи акций.</b> Например, при экстремальной жадности на рынках (значение индекса выше 80 пунктов) лучше продавать активы, а не покупать их.\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9189.png')\"><b>👉</b></i> <a href=\"https://t.me/AK47pfl/5166\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Подробнее об индикаторе</a>.\n\n<a href=\"?q=%23morning\">#morning</a> <a href=\"?q=%23%D0%96%D0%B8%D0%A1\">#ЖиС</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Индикатор ЖиС Россия. 20.05.2022.\n\nТекущее настроение: Страх.\n\nИндикатор ЖиС помогает выбрать лучшие периоды для покупки и продажи акций. Например, при экстремальной жадности на рынках (значение индекса выше 80 пунктов) лучше продавать активы, а не покупать их.\n  Подробнее об индикаторе.\n\n#morning #ЖиС\n@AK47pfl",
  "publishedAt": "2022-05-20 08:00:00",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.19596264367816096
     ],
     [
      "bulgarian",
      0.1660632183908045
     ],
     [
      "macedonian",
      0.13525862068965522
     ]
    ]
   },
   "ner": [
    {
     "score": "0.936",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 2,
      "end": 2
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000070333480835,
     "__label__neg": 0.000012929283911944367
    }
   }
  }
 },
 "md5": "aa683c2b6fd9dfab107ca85c831ebc22",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:00 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29880.png')\"><b>☀️</b></i> <b>20.05.2022</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F87B7F09F87BA.png')\"><b>🇷🇺</b></i> \n• Россияне <a href=\"https://www.cbr.ru/Collection/Collection/File/40997/LB_2022-74.pdf\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">внесли</a> в марте на краткосрочные депозиты рекордные 8.5 трлн рублей.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F8C8E.png')\"><b>🌎</b></i>\n• Страны G7 обсудили создание <a href=\"https://www.wsj.com/livecoverage/russia-ukraine-latest-news-2022-05-19/card/yellen-says-u-s-allies-discuss-secondary-sanctions-to-enforce-possible-price-cap-on-russian-oil-NU9xk0vbdJ5wMD6yfQ5K\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">картеля для контроля цен</a> на российскую нефть, который позволит полностью не отказываться от поставок.\n• Шри-Ланка <a href=\"https://www.bloomberg.com/news/articles/2022-05-19/sri-lanka-enters-default-and-warns-inflation-may-surge-to-40?sref=ZVajCYcV\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">объявила дефолт</a>. Прогноз инфляции в стране вырос до 40%.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F87A8F09F87B3.png')\"><b>🇨🇳</b></i>\n• Импорт российской нефти в Китай в январе—апреле снизился на 7.4%.\n• Китай ведет переговоры с Россией о покупке <a href=\"https://www.bloomberg.com/news/articles/2022-05-19/china-in-talks-with-russia-to-buy-oil-for-strategic-reserves\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">нефти для стратегических запасов</a>.\n• Китай настаивает на том, чтобы партийные элиты избавлялись от <a href=\"https://www.wsj.com/articles/china-insists-party-elites-shed-overseas-assets-eyeing-western-sanctions-on-russia-11652956787\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">зарубежных активов</a>, наблюдая за санкциями Запада в отношении России.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29D97.png')\"><b>❗️</b></i><b>Ожидается:</b>\n• Совбез РФ при участии Путина.\n• Россети Центр (<a href=\"https://putinomics.ru/dashboard/MRKC/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">MRKC</a>), Казаньоргсинтез (<a href=\"https://putinomics.ru/dashboard/KZOS/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">KZOS</a>): СД обсудит дивиденды.\n\n<a href=\"?q=%23morning\">#morning</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  20.05.2022\n\n  \n  Россияне внесли в марте на краткосрочные депозиты рекордные 8.5 трлн рублей.\n\n \n  Страны G7 обсудили создание картеля для контроля цен на российскую нефть, который позволит полностью не отказываться от поставок.\n  Шри-Ланка объявила дефолт. Прогноз инфляции в стране вырос до 40%.\n\n \n  Импорт российской нефти в Китай в январе апреле снизился на 7.4%.\n  Китай ведет переговоры с Россией о покупке нефти для стратегических запасов.\n  Китай настаивает на том, чтобы партийные элиты избавлялись от зарубежных активов, наблюдая за санкциями Запада в отношении России.\n\n Ожидается:\n  Совбез РФ при участии Путина.\n  Россети Центр (MRKC), Казаньоргсинтез (KZOS): СД обсудит дивиденды.\n\n#morning\n@AK47pfl",
  "publishedAt": "2022-05-20 09:30:26",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.22116666666666662
     ],
     [
      "bulgarian",
      0.17731111111111109
     ],
     [
      "macedonian",
      0.1636777777777777
     ]
    ]
   },
   "ner": [
    {
     "score": "0.717",
     "tag": "ORG",
     "entity": "дефолт",
     "range": {
      "start": 35,
      "end": 35
     }
    },
    {
     "score": "1.237",
     "tag": "LOC",
     "entity": "Китай",
     "range": {
      "start": 49,
      "end": 49
     }
    },
    {
     "score": "0.839",
     "tag": "LOC",
     "entity": "Китай",
     "range": {
      "start": 57,
      "end": 57
     }
    },
    {
     "score": "0.921",
     "tag": "LOC",
     "entity": "Россией",
     "range": {
      "start": 61,
      "end": 61
     }
    },
    {
     "score": "0.785",
     "tag": "LOC",
     "entity": "Китай",
     "range": {
      "start": 69,
      "end": 69
     }
    },
    {
     "score": "0.517",
     "tag": "LOC",
     "entity": "Запада",
     "range": {
      "start": 85,
      "end": 85
     }
    },
    {
     "score": "1.237",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 88,
      "end": 88
     }
    },
    {
     "score": "0.184",
     "tag": "ORG",
     "entity": "Совбез РФ",
     "range": {
      "start": 92,
      "end": 93
     }
    },
    {
     "score": "1.025",
     "tag": "PERS",
     "entity": "Путина",
     "range": {
      "start": 96,
      "end": 96
     }
    },
    {
     "score": "0.462",
     "tag": "ORG",
     "entity": "KZOS",
     "range": {
      "start": 106,
      "end": 106
     }
    },
    {
     "score": "0.141",
     "tag": "LOC",
     "entity": "СД",
     "range": {
      "start": 109,
      "end": 109
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__neg": 0.6809931397438049,
     "__label__pos": 0.3190268874168396
    }
   }
  }
 },
 "md5": "b3f9dcbd3aa63ab7613c6a4c0634f334",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:00 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<a href=\"?q=%23%D0%9C%D0%B0%D0%BA%D1%80%D0%BE\">#Макро</a> <a href=\"?q=%23%D0%A6%D0%91%D0%A0%D0%A4\">#ЦБРФ</a>\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29AA1.png')\"><b>⚡️</b></i> <b>ЦБ отменяет запрет на короткие продажи с 1 июня \n\n</b>Также отменяется запрет на покупку валюты с плечом.",
  "text": "#Макро #ЦБРФ\n  ЦБ отменяет запрет на короткие продажи с 1 июня \n\nТакже отменяется запрет на покупку валюты с плечом.",
  "publishedAt": "2022-05-20 02:59:46",
  "nlp": {
   "language": {
    "locale": "uk",
    "scores": [
     [
      "ukrainian",
      0.19175824175824174
     ],
     [
      "russian",
      0.18970695970695972
     ],
     [
      "bulgarian",
      0.18241758241758244
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9537788033485413,
     "__label__neg": 0.04624127224087715
    }
   }
  }
 },
 "md5": "28046cea205ce05ded48c64b0f3ea454",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:00 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F92AD.png')\"><b>💭</b></i> <b>Высокая инфляция и ужесточение политики ЦБ продолжают давить рынки всех активов в мире. Из свежего:</b>\n\n• Инфляция производителей в Германии в апреле +33.5% к прошлому году — максимум за историю наблюдений (~50 лет), в Турции потребительская инфляция +70% (максимум за 20 лет).\n\n• S&amp;P 500 (ключевой индекс акций для мира) <a href=\"https://twitter.com/lizannsonders/status/1527250692414529536?s=21&amp;t=OcNvM2W2wa__wpUsUfg3XA\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">ниже</a> своих 50-, 200-, 500-дневок (если это не медвежий рынок, то что?).\n\n• Дорогие и дефицитные еда и энергия, повышение долларовых ставок привели Шри-Ланку в <a href=\"https://www.bloomberg.com/news/articles/2022-05-19/sri-lanka-enters-default-and-warns-inflation-may-surge-to-40?sref=ZVajCYcV\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">дефолт</a>.\n\n<a href=\"?q=%23%D0%BC%D1%8B%D1%81%D0%BB%D0%B8\">#мысли</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Высокая инфляция и ужесточение политики ЦБ продолжают давить рынки всех активов в мире. Из свежего:\n\n  Инфляция производителей в Германии в апреле +33.5% к прошлому году   максимум за историю наблюдений (~50 лет), в Турции потребительская инфляция +70% (максимум за 20 лет).\n\n  S&P 500 (ключевой индекс акций для мира) ниже своих 50-, 200-, 500-дневок (если это не медвежий рынок, то что?).\n\n  Дорогие и дефицитные еда и энергия, повышение долларовых ставок привели Шри-Ланку в дефолт.\n\n#мысли\n@AK47pfl",
  "publishedAt": "2022-05-20 10:31:07",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.18034444444444442
     ],
     [
      "bulgarian",
      0.16318888888888894
     ],
     [
      "macedonian",
      0.13850000000000007
     ]
    ]
   },
   "ner": [
    {
     "score": "0.954",
     "tag": "ORG",
     "entity": "ЦБ",
     "range": {
      "start": 5,
      "end": 5
     }
    },
    {
     "score": "1.304",
     "tag": "LOC",
     "entity": "Германии",
     "range": {
      "start": 20,
      "end": 20
     }
    },
    {
     "score": "1.887",
     "tag": "LOC",
     "entity": "Турции",
     "range": {
      "start": 37,
      "end": 37
     }
    },
    {
     "score": "1.043",
     "tag": "ORG",
     "entity": "S&P",
     "range": {
      "start": 48,
      "end": 48
     }
    },
    {
     "score": "0.410",
     "tag": "LOC",
     "entity": "Шри-Ланку",
     "range": {
      "start": 87,
      "end": 87
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.8459363579750061,
     "__label__neg": 0.1540837287902832
    }
   }
  }
 },
 "md5": "e1b6368dc9466fa6ef9f75609eab4bec",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:00 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<a href=\"?q=%23SGZH\">#SGZH</a> <a href=\"?q=%23%D0%9E%D1%82%D1%87%D0%B5%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C\">#Отчетность</a>\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F96A8.png')\"><b>🖨</b></i> <b>Сегежа: МСФО 1кв2022</b>\n\nВыручка 35.6 млрд руб (+96% г/г)\nOIBDA 11.8 млрд руб (х2.3 г/г)\nЧистый долг 93 млрд руб (+64% г/г на фоне выплаты дивидендов и основной суммы по сделке с ИФР)",
  "text": "#SGZH #Отчетность\n  Сегежа: МСФО 1кв2022\n\nВыручка 35.6 млрд руб (+96% г/г)\nOIBDA 11.8 млрд руб (х2.3 г/г)\nЧистый долг 93 млрд руб (+64% г/г на фоне выплаты дивидендов и основной суммы по сделке с ИФР)",
  "publishedAt": "2022-05-20 11:00:37",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.13446581196581198
     ],
     [
      "bulgarian",
      0.11352564102564111
     ],
     [
      "macedonian",
      0.10585470085470094
     ]
    ]
   },
   "ner": [
    {
     "score": "0.342",
     "tag": "ORG",
     "entity": "ИФР",
     "range": {
      "start": 40,
      "end": 40
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.999190628528595,
     "__label__neg": 0.0008294197032228112
    }
   }
  }
 },
 "md5": "609180d8ef8fe2ac066f71ba18100cf0",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:00 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09FAAB5.png')\"><b>🪵</b></i> <b>Как меняются российские компании. Сегеже (<a href=\"https://putinomics.ru/dashboard/SGZH/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">SGZH</a>) удается сохранять высокий темп роста показателей за счёт переориентации поставок и роста цен на продукцию.</b>\n\n<a href=\"https://t.me/AK47pfl/12178\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">По итогам 1кв2022</a>:\n• <b>Выручка</b> <b>+96% </b>г/г\n• <b>OIBDA</b> <b>+130%</b> г/г\n\nГлавное из пресс-релиза:\n\n1. <u><a href=\"https://segezha-group.com/upload/iblock/55f/mrum3n5wgoljyi8xhpy61mjbsikttpbj.pdf\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Цены на продукцию</a> вблизи максимумов</u> (см. фото);\n\n2. <a href=\"https://segezha-group.com/upload/iblock/f13/juoh88e7iz4loc5y32nazzg0yupndoxe.pdf\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\"><u>Объемы растут в среднем на 64%</u></a>, а по некоторым продуктам в 3 раза. Компания сообщает, что переместила Европейские поставки в Египет и Китай.\n\n<a href=\"?q=%23SGZH\">#SGZH</a>\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Как меняются российские компании. Сегеже (SGZH) удается сохранять высокий темп роста показателей за счёт переориентации поставок и роста цен на продукцию.\n\nПо итогам 1кв2022:\n  Выручка +96% г/г\n  OIBDA +130% г/г\n\nГлавное из пресс-релиза:\n\n1. Цены на продукцию вблизи максимумов (см. фото);\n\n2. Объемы растут в среднем на 64%, а по некоторым продуктам в 3 раза. Компания сообщает, что переместила Европейские поставки в Египет и Китай.\n\n#SGZH\n@AK47pfl",
  "publishedAt": "2022-05-20 11:18:46",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.1950777777777778
     ],
     [
      "bulgarian",
      0.17996666666666672
     ],
     [
      "macedonian",
      0.1636333333333333
     ]
    ]
   },
   "ner": [
    {
     "score": "0.337",
     "tag": "PERS",
     "entity": "российские компании . Сегеже",
     "range": {
      "start": 2,
      "end": 5
     }
    },
    {
     "score": "0.597",
     "tag": "ORG",
     "entity": "SGZH",
     "range": {
      "start": 7,
      "end": 7
     }
    },
    {
     "score": "0.925",
     "tag": "LOC",
     "entity": "Египет",
     "range": {
      "start": 75,
      "end": 75
     }
    },
    {
     "score": "0.997",
     "tag": "LOC",
     "entity": "Китай",
     "range": {
      "start": 77,
      "end": 77
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9987820982933044,
     "__label__neg": 0.0012379089603200555
    }
   }
  }
 },
 "md5": "80ac2a316c9edb90f894c6a2bc2f25c8",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:01 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> <b>А что если укрепление рубля — скрытый удар Запада?</b> <b>Слишком крепкий рубль бьёт по экономике России сильнее, чем слабый</b> <b>рубль.</b>\n\nЗапад в начале спецоперации <u>обещал</u> невиданный обвал рубля и обеднение населения, это мог быть блеф.\n\nЧто в действительности <u>сделал</u> Запад — остановил импорт в Россию и мешает Китаю поставлять товары в РФ угрозами санкций.\n\nВ цифрах падение импорта выглядит так:\n• Импорт товаров из Евросоюза в Россию в марте 2022 года упал на 55% г/г – до €3.42 млрд. \n• Импорт товаров из Китая в Россию за апрель сократился на 25.8% г/г – до $3.8 млрд.\n\nВ то же время экспорт из России в ЕС в марте увеличился на 75% г/г – до €16.2 млрд.\n\nЕвропа выкачивает наши природные ресурсы и не поставляет нам собственные товары. В условиях определения курса рубля торговым балансом Запад делает все, чтобы укрепить российский рубль.\n\n<u>Зачем это нужно Западу? </u>\n\nНас ведут в состояние неконкурентоспособности по сравнению с другими экономиками. Россию заразили <a href=\"https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BB%D0%BB%D0%B0%D0%BD%D0%B4%D1%81%D0%BA%D0%B0%D1%8F_%D0%B1%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D1%8C\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">голландской болезнью</a>: производить что-то в России становится невыгодно, дешевле купить за рубежом — слишком дорого стоят локальные трудовые ресурсы в сравнении с другими странами. Так, например, с Китаем Россия <a href=\"https://t.me/AK47pfl/11761\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">сможет конкурировать</a> по 75 ₽/$, с Турцией по 95 ₽/$, с Таиландом по 115 ₽/$.\n\n<u>Как можно этому противостоять? Немного ослабить рубль</u>\n\n1. Снизить экспорт и увеличить импорт — перестать питать Европу ресурсами в условиях гибридной войны. Вынудить Европу платить за газ чуть ли не бартером под угрозой остановок поставок энергоресурсов или продовольственных товаров.\n2. Открыть нерезидентов на бирже — дать им продать российские активы, но по низким ценам. Нерезиденты будут продавать на бирже рубли и конвертировать их в доллары и евро.\n3. Смягчить валютные ограничения для граждан и бизнеса РФ, но остаётся тонкий момент — нужно замотивировать капитал остаться в стране.\n\nСлишком крепкий курс бьёт по нашей экономике даже сильнее, чем если бы курс был выше 100 ₽/$. Если так будет продолжаться, Запад добьётся того, что производства в России будут закрываться, экономика начнет сжиматься.\n\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  А что если укрепление рубля   скрытый удар Запада? Слишком крепкий рубль бьёт по экономике России сильнее, чем слабый рубль.\n\nЗапад в начале спецоперации обещал невиданный обвал рубля и обеднение населения, это мог быть блеф.\n\nЧто в действительности сделал Запад   остановил импорт в Россию и мешает Китаю поставлять товары в РФ угрозами санкций.\n\nВ цифрах падение импорта выглядит так:\n  Импорт товаров из Евросоюза в Россию в марте 2022 года упал на 55% г/г   до  3.42 млрд. \n  Импорт товаров из Китая в Россию за апрель сократился на 25.8% г/г   до $3.8 млрд.\n\nВ то же время экспорт из России в ЕС в марте увеличился на 75% г/г   до  16.2 млрд.\n\nЕвропа выкачивает наши природные ресурсы и не поставляет нам собственные товары. В условиях определения курса рубля торговым балансом Запад делает все, чтобы укрепить российский рубль.\n\nЗачем это нужно Западу? \n\nНас ведут в состояние неконкурентоспособности по сравнению с другими экономиками. Россию заразили голландской болезнью: производить что-то в России становится невыгодно, дешевле купить за рубежом   слишком дорого стоят локальные трудовые ресурсы в сравнении с другими странами. Так, например, с Китаем Россия сможет конкурировать по 75  /$, с Турцией по 95  /$, с Таиландом по 115  /$.\n\nКак можно этому противостоять? Немного ослабить рубль\n\n1. Снизить экспорт и увеличить импорт   перестать питать Европу ресурсами в условиях гибридной войны. Вынудить Европу платить за газ чуть ли не бартером под угрозой остановок поставок энергоресурсов или продовольственных товаров.\n2. Открыть нерезидентов на бирже   дать им продать российские активы, но по низким ценам. Нерезиденты будут продавать на бирже рубли и конвертировать их в доллары и евро.\n3. Смягчить валютные ограничения для граждан и бизнеса РФ, но остаётся тонкий момент   нужно замотивировать капитал остаться в стране.\n\nСлишком крепкий курс бьёт по нашей экономике даже сильнее, чем если бы курс был выше 100  /$. Если так будет продолжаться, Запад добьётся того, что производства в России будут закрываться, экономика начнет сжиматься.\n\n@AK47pfl",
  "publishedAt": "2022-05-20 01:36:24",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.28837777777777773
     ],
     [
      "bulgarian",
      0.21025555555555553
     ],
     [
      "ukrainian",
      0.20409999999999995
     ]
    ]
   },
   "ner": [
    {
     "score": "0.710",
     "tag": "LOC",
     "entity": "Запада",
     "range": {
      "start": 7,
      "end": 7
     }
    },
    {
     "score": "1.166",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 15,
      "end": 15
     }
    },
    {
     "score": "0.959",
     "tag": "LOC",
     "entity": "Запад",
     "range": {
      "start": 22,
      "end": 22
     }
    },
    {
     "score": "0.840",
     "tag": "LOC",
     "entity": "Запад",
     "range": {
      "start": 43,
      "end": 43
     }
    },
    {
     "score": "1.344",
     "tag": "LOC",
     "entity": "Россию",
     "range": {
      "start": 47,
      "end": 47
     }
    },
    {
     "score": "0.263",
     "tag": "LOC",
     "entity": "Китаю",
     "range": {
      "start": 50,
      "end": 50
     }
    },
    {
     "score": "1.378",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 54,
      "end": 54
     }
    },
    {
     "score": "0.708",
     "tag": "ORG",
     "entity": "Евросоюза",
     "range": {
      "start": 68,
      "end": 68
     }
    },
    {
     "score": "1.347",
     "tag": "LOC",
     "entity": "Россию",
     "range": {
      "start": 70,
      "end": 70
     }
    },
    {
     "score": "1.107",
     "tag": "LOC",
     "entity": "Китая",
     "range": {
      "start": 86,
      "end": 86
     }
    },
    {
     "score": "1.546",
     "tag": "LOC",
     "entity": "Россию",
     "range": {
      "start": 88,
      "end": 88
     }
    },
    {
     "score": "1.603",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 105,
      "end": 105
     }
    },
    {
     "score": "0.872",
     "tag": "ORG",
     "entity": "ЕС",
     "range": {
      "start": 107,
      "end": 107
     }
    },
    {
     "score": "0.662",
     "tag": "LOC",
     "entity": "Европа",
     "range": {
      "start": 118,
      "end": 118
     }
    },
    {
     "score": "0.945",
     "tag": "LOC",
     "entity": "Запад",
     "range": {
      "start": 137,
      "end": 137
     }
    },
    {
     "score": "1.144",
     "tag": "LOC",
     "entity": "Россию",
     "range": {
      "start": 162,
      "end": 162
     }
    },
    {
     "score": "1.378",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 170,
      "end": 170
     }
    },
    {
     "score": "0.461",
     "tag": "LOC",
     "entity": "Китаем",
     "range": {
      "start": 195,
      "end": 195
     }
    },
    {
     "score": "0.885",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 196,
      "end": 196
     }
    },
    {
     "score": "1.172",
     "tag": "LOC",
     "entity": "Турцией",
     "range": {
      "start": 204,
      "end": 204
     }
    },
    {
     "score": "0.872",
     "tag": "LOC",
     "entity": "Таиландом",
     "range": {
      "start": 210,
      "end": 210
     }
    },
    {
     "score": "0.317",
     "tag": "PERS",
     "entity": "Снизить",
     "range": {
      "start": 224,
      "end": 224
     }
    },
    {
     "score": "1.040",
     "tag": "LOC",
     "entity": "Европу",
     "range": {
      "start": 231,
      "end": 231
     }
    },
    {
     "score": "0.673",
     "tag": "LOC",
     "entity": "Европу",
     "range": {
      "start": 239,
      "end": 239
     }
    },
    {
     "score": "0.217",
     "tag": "LOC",
     "entity": "Смягчить",
     "range": {
      "start": 287,
      "end": 287
     }
    },
    {
     "score": "0.728",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 294,
      "end": 294
     }
    },
    {
     "score": "0.991",
     "tag": "LOC",
     "entity": "Запад",
     "range": {
      "start": 331,
      "end": 331
     }
    },
    {
     "score": "1.358",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 338,
      "end": 338
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__neg": 0.5118790864944458,
     "__label__pos": 0.48814094066619873
    }
   }
  }
 },
 "md5": "ea54a50630ea00d32c757f3be2af7474",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:01 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29D97.png')\"><b>❗️</b></i><b> С начала года доллар к рублю -20%, несмотря на то, что к валютам других стран СНГ он в нуле, а к турецкой лире даже окреп.</b> При таком курсе рубля: \n\n• Зачем <a href=\"https://t.me/AK47pfl/11761\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">нанимать</a> российских рабочих, если можно нанять мигрантов из СНГ, «подешевевших» на 20% с начала года?\n• Зачем отдыхать в России, когда можно отдохнуть в более дешёвой Турции или даже <a href=\"https://t.me/finpizdec/9983\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">на Мальдивах</a>?\n• Как во многих товарах российскому труду обыграть турецкий или узбекский?\n• Зачем инвестировать в создание производства в РФ, если выгоднее открыть в Узбекистане и возить в РФ? \n• Зачем инвестировать в российские акции или недвижимость, когда интереснее купить элитную недвижимость в Дубае, которая при текущем курсе стоит 400 тысяч рублей/м2 с ВНЖ?\n\nДа, дорогой рубль стимулирует спрос, больше россиян отдохнут за границей и купят иностранную недвижимость. Но это сейчас, при курсе нефти $100+ за баррель.\n\n<b>А что будет, если нефть вдруг вернётся к $30-50?..</b> Ведь никаких секторов и новых рабочих мест, помимо добычи сырья, в РФ создано не будет.\n\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  С начала года доллар к рублю -20%, несмотря на то, что к валютам других стран СНГ он в нуле, а к турецкой лире даже окреп. При таком курсе рубля: \n\n  Зачем нанимать российских рабочих, если можно нанять мигрантов из СНГ, «подешевевших» на 20% с начала года?\n  Зачем отдыхать в России, когда можно отдохнуть в более дешёвой Турции или даже на Мальдивах?\n  Как во многих товарах российскому труду обыграть турецкий или узбекский?\n  Зачем инвестировать в создание производства в РФ, если выгоднее открыть в Узбекистане и возить в РФ? \n  Зачем инвестировать в российские акции или недвижимость, когда интереснее купить элитную недвижимость в Дубае, которая при текущем курсе стоит 400 тысяч рублей/м2 с ВНЖ?\n\nДа, дорогой рубль стимулирует спрос, больше россиян отдохнут за границей и купят иностранную недвижимость. Но это сейчас, при курсе нефти $100+ за баррель.\n\nА что будет, если нефть вдруг вернётся к $30-50?.. Ведь никаких секторов и новых рабочих мест, помимо добычи сырья, в РФ создано не будет.\n\n@AK47pfl",
  "publishedAt": "2022-05-20 06:29:39",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2778666666666667
     ],
     [
      "bulgarian",
      0.20800000000000007
     ],
     [
      "macedonian",
      0.18594444444444447
     ]
    ]
   },
   "ner": [
    {
     "score": "0.554",
     "tag": "ORG",
     "entity": "СНГ",
     "range": {
      "start": 17,
      "end": 17
     }
    },
    {
     "score": "0.809",
     "tag": "LOC",
     "entity": "нуле",
     "range": {
      "start": 20,
      "end": 20
     }
    },
    {
     "score": "0.481",
     "tag": "ORG",
     "entity": "СНГ",
     "range": {
      "start": 44,
      "end": 44
     }
    },
    {
     "score": "0.215",
     "tag": "PERS",
     "entity": "«подешевевших»",
     "range": {
      "start": 46,
      "end": 46
     }
    },
    {
     "score": "1.669",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 56,
      "end": 56
     }
    },
    {
     "score": "1.541",
     "tag": "LOC",
     "entity": "Турции",
     "range": {
      "start": 64,
      "end": 64
     }
    },
    {
     "score": "1.207",
     "tag": "LOC",
     "entity": "Мальдивах",
     "range": {
      "start": 68,
      "end": 68
     }
    },
    {
     "score": "1.159",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 87,
      "end": 87
     }
    },
    {
     "score": "1.281",
     "tag": "LOC",
     "entity": "Узбекистане",
     "range": {
      "start": 93,
      "end": 93
     }
    },
    {
     "score": "1.420",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 97,
      "end": 97
     }
    },
    {
     "score": "0.998",
     "tag": "LOC",
     "entity": "Дубае",
     "range": {
      "start": 113,
      "end": 113
     }
    },
    {
     "score": "0.232",
     "tag": "ORG",
     "entity": "ВНЖ",
     "range": {
      "start": 124,
      "end": 124
     }
    },
    {
     "score": "1.300",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 180,
      "end": 180
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.8833940625190735,
     "__label__neg": 0.11662597954273224
    }
   }
  }
 },
 "md5": "6b12c5c9ddc5b485dfc756ce2f66e871",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:01 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> <b>Самые заметные движения недели на фондовом рынке. </b>Что сильнее всего выросло или упало и почему. Совместная рубрика Незыгаря <a href=\"https://t.me/russica2\" target=\"_blank\">@russica2</a> и РДВ.\n\n<b>Доллар к Российскому рублю -6%, к Белорусскому рублю -1%,</b> <b>к Узбексому суму -1%,</b> <b>к Китайскому юаню -0%, к Казахскому тенге -0%, Турецкой лире +3%.</b> Рубль продолжает укрепляться к валютам стран торговых партнеров, подъедая конкурентоспособность России <a href=\"https://t.me/AK47pfl/12180\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">как производителя</a>, как места для <a href=\"https://t.me/AK47pfl/12182\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">отдыха</a>, снижая конкурентоспособность российских <a href=\"https://t.me/AK47pfl/12182\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">кадров</a> в сравнении с мигрантами.\n\n<b>МТС (<a href=\"https://putinomics.ru/dashboard/MTSS/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">MTSS</a>) +19%, Газпромнефть (<a href=\"https://putinomics.ru/dashboard/SIBN/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">SIBN</a>) +6%, Сургутнефтегаз (<a href=\"https://putinomics.ru/dashboard/SNGS/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">SNGS</a>) +4%.</b> Молодцы! Как и обещали — утверждают дивиденды. Компании делятся прибылью с акционерами, это привлекает инвесторов.\n\n<b>Русал (<a href=\"https://putinomics.ru/dashboard/RUAL/MOEX\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">RUAL</a>) -3%. </b>Русал «держит планку» — как всегда не заплатил.\n\n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Самые заметные движения недели на фондовом рынке. Что сильнее всего выросло или упало и почему. Совместная рубрика Незыгаря @russica2 и РДВ.\n\nДоллар к Российскому рублю -6%, к Белорусскому рублю -1%, к Узбексому суму -1%, к Китайскому юаню -0%, к Казахскому тенге -0%, Турецкой лире +3%. Рубль продолжает укрепляться к валютам стран торговых партнеров, подъедая конкурентоспособность России как производителя, как места для отдыха, снижая конкурентоспособность российских кадров в сравнении с мигрантами.\n\nМТС (MTSS) +19%, Газпромнефть (SIBN) +6%, Сургутнефтегаз (SNGS) +4%. Молодцы! Как и обещали   утверждают дивиденды. Компании делятся прибылью с акционерами, это привлекает инвесторов.\n\nРусал (RUAL) -3%. Русал «держит планку»   как всегда не заплатил.\n\n@AK47pfl",
  "publishedAt": "2022-05-20 07:10:28",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2173666666666667
     ],
     [
      "bulgarian",
      0.15570000000000006
     ],
     [
      "ukrainian",
      0.13715555555555548
     ]
    ]
   },
   "ner": [
    {
     "score": "0.558",
     "tag": "ORG",
     "entity": "РДВ",
     "range": {
      "start": 22,
      "end": 22
     }
    },
    {
     "score": "0.775",
     "tag": "ORG",
     "entity": "Белорусскому рублю -1% ,",
     "range": {
      "start": 31,
      "end": 34
     }
    },
    {
     "score": "0.332",
     "tag": "PERS",
     "entity": "Китайскому",
     "range": {
      "start": 41,
      "end": 41
     }
    },
    {
     "score": "0.432",
     "tag": "PERS",
     "entity": "Казахскому",
     "range": {
      "start": 46,
      "end": 46
     }
    },
    {
     "score": "1.071",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 65,
      "end": 65
     }
    },
    {
     "score": "0.535",
     "tag": "ORG",
     "entity": "MTSS",
     "range": {
      "start": 85,
      "end": 85
     }
    },
    {
     "score": "0.750",
     "tag": "ORG",
     "entity": "SIBN",
     "range": {
      "start": 91,
      "end": 91
     }
    },
    {
     "score": "0.152",
     "tag": "LOC",
     "entity": "Сургутнефтегаз",
     "range": {
      "start": 95,
      "end": 95
     }
    },
    {
     "score": "0.732",
     "tag": "ORG",
     "entity": "SNGS",
     "range": {
      "start": 97,
      "end": 97
     }
    },
    {
     "score": "0.864",
     "tag": "ORG",
     "entity": "RUAL",
     "range": {
      "start": 121,
      "end": 121
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9460734128952026,
     "__label__neg": 0.0539465956389904
    }
   }
  }
 },
 "md5": "79b315d71f06e47690971206d903b601",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:02 -> {
 "type": "telegram",
 "url": "https://t.me/AK47pfl",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AK47pfl",
   "title": "РынкиДеньгиВласть | РДВ",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F949D.png')\"><b>🔝</b></i> аналитика по российскому рынку ценных бумаг, которая ранее была доступна лишь финансовым элитам. Впереди брокеров и банков.<br><br>Стратегические вопросы: <a href=\"https://t.me/dragonwoo\" target=\"_blank\">@dragonwoo</a><br><br>Реклама - агент PR Fintech: <a href=\"https://t.me/arina_promo\" target=\"_blank\">@arina_promo</a><br><br>Сервис для инвесторов и трейдеров <a href=\"https://t.me/RDVPREMIUMbot\" target=\"_blank\">@RDVPREMIUMbot</a>",
   "image": "https://cdn4.telegram-cdn.org/file/K6ElYTboYxlNDAQtTFVbTtEJqoLvw7aOqe9hbedxboMDpAaS-V0T1a2qMt_iFXrmjhoz7vJQWGx10xfl9Z6c5h-0VB1J-HcgAqwpEk9_gHfrf73-58gGUy4kEe8TS8JGTypH4KMhCr5CnU2VmRSPwAHRT6SrIhs2WNXmCcYpmwNC88yixy27FR6GbTOSUqjWiqqzTWfAefZC0vas6bg5nYrCyONghQ-XcKN_7JZipwOm1s-cJFAOsd8JKvY9fRjE0oXTNEX_tNogD5viypXP1rlbZZyWL5ttUC_2nwfEWWpfjcQvtphxv27JXG-PAOfrieeU0aYd4C7hpC9GEeEttg.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E29D97.png')\"><b>❗️</b></i> <b>Самое важное за неделю:</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> Укрепление рубля — <a href=\"https://t.me/AK47pfl/12180\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">скрытый удар Запада</a>? Слишком крепкий рубль бьёт по экономике РФ сильнее, чем слабый рубль. \n2. <a href=\"https://t.me/AK47pfl/12166\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Европа хитрит</a>: смягчила риторику в отношении российского газа, чтобы заполнить хранилища.\n3. С начала года доллар к рублю -20%, другие валюты СНГ в нуле. <a href=\"https://t.me/AK47pfl/12182\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Что это значит</a> для России?\n4. <a href=\"https://t.me/AK47pfl/12160\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Два пути</a> трансформация российской экономики. О чём <a href=\"https://t.me/AK47pfl/12171\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">говорит помощник президента</a> РФ Орешкин.\n5. Какими должны быть (или могли бы быть) <a href=\"https://t.me/AK47pfl/12133\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">отношения России и Запада</a>.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9189.png')\"><b>👉</b></i> <a href=\"https://t.me/AK47pfl/12165\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">RDV PREMIUM — ваш путь к успешным инвестициям и свободе.</a>\n<a href=\"https://t.me/AK47pfl/10853\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">\n</a><a href=\"?q=%23RDVweekly\">#RDVweekly</a> \n<a href=\"https://t.me/AK47pfl\" target=\"_blank\">@AK47pfl</a>",
  "text": "  Самое важное за неделю:\n\n  Укрепление рубля   скрытый удар Запада? Слишком крепкий рубль бьёт по экономике РФ сильнее, чем слабый рубль. \n2. Европа хитрит: смягчила риторику в отношении российского газа, чтобы заполнить хранилища.\n3. С начала года доллар к рублю -20%, другие валюты СНГ в нуле. Что это значит для России?\n4. Два пути трансформация российской экономики. О чём говорит помощник президента РФ Орешкин.\n5. Какими должны быть (или могли бы быть) отношения России и Запада.\n\n  RDV PREMIUM   ваш путь к успешным инвестициям и свободе.\n\n#RDVweekly \n@AK47pfl",
  "publishedAt": "2022-05-21 12:00:00",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.18000000000000005
     ],
     [
      "bulgarian",
      0.15774444444444446
     ],
     [
      "macedonian",
      0.12061111111111111
     ]
    ]
   },
   "ner": [
    {
     "score": "0.510",
     "tag": "LOC",
     "entity": "Запада",
     "range": {
      "start": 9,
      "end": 9
     }
    },
    {
     "score": "0.891",
     "tag": "LOC",
     "entity": "РФ",
     "range": {
      "start": 17,
      "end": 17
     }
    },
    {
     "score": "0.482",
     "tag": "LOC",
     "entity": "Европа",
     "range": {
      "start": 25,
      "end": 25
     }
    },
    {
     "score": "1.491",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 58,
      "end": 58
     }
    },
    {
     "score": "0.736",
     "tag": "LOC",
     "entity": "РФ Орешкин",
     "range": {
      "start": 72,
      "end": 73
     }
    },
    {
     "score": "1.212",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 86,
      "end": 86
     }
    },
    {
     "score": "0.829",
     "tag": "LOC",
     "entity": "Запада",
     "range": {
      "start": 88,
      "end": 88
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.8561378717422485,
     "__label__neg": 0.14388211071491241
    }
   }
  }
 },
 "md5": "4765e60526531637237781a2867316fa",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:02 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>В Латвии объявили энергетический кризис из-за ситуации с нефтепродуктами\n\n</b>В Латвии до 31 декабря объявили энергетический кризис из-за ситуации с нефтепродуктами.\n\n<a href=\"https://t.me/alleconomics\" target=\"_blank\">@alleconomics</a>",
  "text": "В Латвии объявили энергетический кризис из-за ситуации с нефтепродуктами\n\nВ Латвии до 31 декабря объявили энергетический кризис из-за ситуации с нефтепродуктами.\n\n@alleconomics",
  "publishedAt": "2022-04-20 02:14:00",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.16635220125786165
     ],
     [
      "bulgarian",
      0.15336477987421382
     ],
     [
      "macedonian",
      0.12537735849056597
     ]
    ]
   },
   "ner": [
    {
     "score": "1.083",
     "tag": "LOC",
     "entity": "Латвии",
     "range": {
      "start": 1,
      "end": 1
     }
    },
    {
     "score": "1.375",
     "tag": "LOC",
     "entity": "Латвии",
     "range": {
      "start": 10,
      "end": 10
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 1.0000094175338745,
     "__label__pos": 0.00001060615795722697
    }
   }
  }
 },
 "md5": "32b45cce81554d5ed97c722eb2ea4d19",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:02 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "Ответ банка по сомнительным комментариям Олега Тинькова",
  "text": "Ответ банка по сомнительным комментариям Олега Тинькова",
  "publishedAt": "2022-04-21 10:10:00",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.25181818181818183
     ],
     [
      "bulgarian",
      0.2392121212121212
     ],
     [
      "macedonian",
      0.18884848484848482
     ]
    ]
   },
   "ner": [
    {
     "score": "0.822",
     "tag": "PERS",
     "entity": "Олега Тинькова",
     "range": {
      "start": 5,
      "end": 6
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.000009536743164,
     "__label__neg": 0.000010460263183631469
    }
   }
  }
 },
 "md5": "6ab246b7b41d0866125bfd88d03f0575",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:02 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Доллар США преодолел 2-х летний максимум.</b>\n\nИндекс, отражающий стоимость доллара США по отношению к шести основным валютам, <b>достиг отметки 101,33</b>, что является самым высоким показателем с марта 2020 года. \n\n\"<i>Макроэкономические факторы по-прежнему указывают на рост доллара, поскольку доходность краткосрочных казначейских облигаций по сравнению с доходностью суверенных облигаций сопоставимого срока погашения положительна, а инфляция во всем мире высока</i>\", - <b>сказал Стэн Шипли</b>, стратег по фиксированным доходам <b>Evercore ISI </b>в Нью-Йорке.\n\n<a href=\"https://t.me/AllEconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Доллар США преодолел 2-х летний максимум.\n\nИндекс, отражающий стоимость доллара США по отношению к шести основным валютам, достиг отметки 101,33, что является самым высоким показателем с марта 2020 года. \n\n\"Макроэкономические факторы по-прежнему указывают на рост доллара, поскольку доходность краткосрочных казначейских облигаций по сравнению с доходностью суверенных облигаций сопоставимого срока погашения положительна, а инфляция во всем мире высока\", - сказал Стэн Шипли, стратег по фиксированным доходам Evercore ISI в Нью-Йорке.\n\nAll Economics",
  "publishedAt": "2022-04-25 03:50:39",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.19608888888888887
     ],
     [
      "bulgarian",
      0.1418666666666667
     ],
     [
      "macedonian",
      0.13536666666666675
     ]
    ]
   },
   "ner": [
    {
     "score": "1.232",
     "tag": "LOC",
     "entity": "США",
     "range": {
      "start": 12,
      "end": 12
     }
    },
    {
     "score": "1.683",
     "tag": "PERS",
     "entity": "Стэн Шипли",
     "range": {
      "start": 68,
      "end": 69
     }
    },
    {
     "score": "1.059",
     "tag": "ORG",
     "entity": "Evercore ISI",
     "range": {
      "start": 75,
      "end": 76
     }
    },
    {
     "score": "1.024",
     "tag": "LOC",
     "entity": "Нью-Йорке",
     "range": {
      "start": 78,
      "end": 78
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.978614091873169,
     "__label__neg": 0.02140594832599163
    }
   }
  }
 },
 "md5": "3d8a82ef912e7a558443b089273851c8",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:03 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Статистика потребления материальных ресурсов в мире. </b>\n\nОжидается, что с расширением городских территорий мировое потребление материальных ресурсов <b>вырастет</b> с 41,1 миллиарда тонн в 2010 году <b>до</b> примерно <b>89 миллиардов тонн к 2050 году.</b>",
  "text": "Статистика потребления материальных ресурсов в мире. \n\nОжидается, что с расширением городских территорий мировое потребление материальных ресурсов вырастет с 41,1 миллиарда тонн в 2010 году до примерно 89 миллиардов тонн к 2050 году.",
  "publishedAt": "2022-04-26 12:55:49",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.250654761904762
     ],
     [
      "bulgarian",
      0.21025793650793656
     ],
     [
      "macedonian",
      0.15942460317460316
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9923461079597473,
     "__label__neg": 0.007673849351704121
    }
   }
  }
 },
 "md5": "d6692c7c32108e0ae3244312dd3a6e00",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:03 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Неожиданное увольнение в China Merchants Bank пугает инвесторов.\nОдин из крупнейших банков мира теряет десятки миллиардов долларов рыночной стоимости.</b>\n\nФинансовый сектор Китая пережил очередную чистку от коррупции. <b>18 апреля</b> <b>правление банка уволило президента и исполнительного директора</b> Тянь Хуйю без объяснения причин. Г-на Тяня не обвиняли в правонарушениях, но местные СМИ связывают его увольнение с расследованием коррупции, которое потрясло шэньчжэньское отделение ccb , его предыдущего работодателя. Несколько бывших коллег Г-на Тиана были привлечены к уголовной ответственности за серьезные нарушения закона.\n\nИнцидент потряс цену акций China Merchants Bank, которая сейчас на 29% ниже своего прошлогоднего пика. <b>К 21 апреля его рыночная капитализация упала до 162 миллиардов долларов</b>\n\n<a href=\"https://t.me/AllEconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Неожиданное увольнение в China Merchants Bank пугает инвесторов.\nОдин из крупнейших банков мира теряет десятки миллиардов долларов рыночной стоимости.\n\nФинансовый сектор Китая пережил очередную чистку от коррупции. 18 апреля правление банка уволило президента и исполнительного директора Тянь Хуйю без объяснения причин. Г-на Тяня не обвиняли в правонарушениях, но местные СМИ связывают его увольнение с расследованием коррупции, которое потрясло шэньчжэньское отделение ccb , его предыдущего работодателя. Несколько бывших коллег Г-на Тиана были привлечены к уголовной ответственности за серьезные нарушения закона.\n\nИнцидент потряс цену акций China Merchants Bank, которая сейчас на 29% ниже своего прошлогоднего пика. К 21 апреля его рыночная капитализация упала до 162 миллиардов долларов\n\nAll Economics",
  "publishedAt": "2022-04-26 03:05:54",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.25125555555555557
     ],
     [
      "bulgarian",
      0.20697777777777782
     ],
     [
      "macedonian",
      0.16371111111111114
     ]
    ]
   },
   "ner": [
    {
     "score": "0.614",
     "tag": "ORG",
     "entity": "China Merchants",
     "range": {
      "start": 3,
      "end": 4
     }
    },
    {
     "score": "0.493",
     "tag": "ORG",
     "entity": "мира",
     "range": {
      "start": 13,
      "end": 13
     }
    },
    {
     "score": "0.581",
     "tag": "LOC",
     "entity": "Китая",
     "range": {
      "start": 23,
      "end": 23
     }
    },
    {
     "score": "0.609",
     "tag": "ORG",
     "entity": "банка",
     "range": {
      "start": 33,
      "end": 33
     }
    },
    {
     "score": "0.260",
     "tag": "ORG",
     "entity": "шэньчжэньское отделение ccb",
     "range": {
      "start": 64,
      "end": 66
     }
    },
    {
     "score": "0.518",
     "tag": "PERS",
     "entity": "Г-на Тиана",
     "range": {
      "start": 75,
      "end": 76
     }
    },
    {
     "score": "0.501",
     "tag": "ORG",
     "entity": "All Economics",
     "range": {
      "start": 115,
      "end": 116
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9985802173614502,
     "__label__pos": 0.0014398000203073025
    }
   }
  }
 },
 "md5": "e477b75259b026ad279d92fe1684a5b7",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:03 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> Банк России понизил ключевую ставку до 14%",
  "text": "  Банк России понизил ключевую ставку до 14% Доллар после значительного понижения ставки никак не отреагировал \n\n\nНе ведитесь на «величие рубля» и «стабильность экономики»!!! Не сдавайте наличные доллары и не продавайте валюту так дёшево! \n\nПройдёт 9 мая, наступит лето, будут восстанавливать импорт и станет всё гораздо менее радужно. \n\n\nПобеждает тот, кто умеет ждать",
  "publishedAt": "2022-04-29 07:15:22",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2346530147895336
     ],
     [
      "bulgarian",
      0.17037542662116034
     ],
     [
      "macedonian",
      0.15285551763367466
     ]
    ]
   },
   "ner": [
    {
     "score": "0.934",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 1,
      "end": 1
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9933042526245117,
     "__label__neg": 0.006715788971632719
    }
   }
  }
 },
 "md5": "44f9390389238b87ff9ac4e29ef69888",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:03 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>«Газпром» объявил, что уйдет с иностранных бирж.  \n\n</b>Если конкретнее, то уход планируется с Лондонской и Сингапурской бирж, где обращаются ценные бумаги, удостоверяющие право держателя на владение акциями иностранного эмитента.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F92AD.png')\"><b>💭</b></i>Т.е. компания произведет <b>делистинг своих депозитарных расписок</b> с зарубежных площадках.\n\nТакое решение «Газпром» принял из-за недавнего закона, в соответствии с которым акции зарегистрированных в России компаний не могут обращаться на иностранных биржах.",
  "text": "«Газпром» объявил, что уйдет с иностранных бирж.  \n\nЕсли конкретнее, то уход планируется с Лондонской и Сингапурской бирж, где обращаются ценные бумаги, удостоверяющие право держателя на владение акциями иностранного эмитента.\n\n Т.е. компания произведет делистинг своих депозитарных расписок с зарубежных площадках.\n\nТакое решение «Газпром» принял из-за недавнего закона, в соответствии с которым акции зарегистрированных в России компаний не могут обращаться на иностранных биржах.",
  "publishedAt": "2022-04-29 07:53:20",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.22474444444444452
     ],
     [
      "bulgarian",
      0.1712555555555556
     ],
     [
      "macedonian",
      0.1698777777777778
     ]
    ]
   },
   "ner": [
    {
     "score": "0.696",
     "tag": "LOC",
     "entity": "Лондонской",
     "range": {
      "start": 16,
      "end": 16
     }
    },
    {
     "score": "0.392",
     "tag": "PERS",
     "entity": "«Газпром»",
     "range": {
      "start": 51,
      "end": 51
     }
    },
    {
     "score": "1.875",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 64,
      "end": 64
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.8767361640930176,
     "__label__neg": 0.12328383326530457
    }
   }
  }
 },
 "md5": "1d2ed79d40bcea1a75a71b8ef2443a1b",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:03 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Какой тип людей вы?\n\n</b><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F918E.png')\"><b>👎</b></i> Бедный\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F918D.png')\"><b>👍</b></i> Средний\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F94A5.png')\"><b>🔥</b></i> Богатый",
  "text": "Какой тип людей вы?\n\n  Бедный\n  Средний\n  Богатый",
  "publishedAt": "2022-05-01 04:36:22",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.17178861788617883
     ],
     [
      "serbian",
      0.16325203252032516
     ],
     [
      "kyrgyz",
      0.08918699186991863
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.999932050704956,
     "__label__neg": 0.00008791778236627579
    }
   }
  }
 },
 "md5": "b2feb6a71da9ebfacc3e441be8c675ea",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:04 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Платежи по еврооблигациям выплачены! </b>\n\nДержатели бумаг \"Россия-2022\" и \"Россия-2042\" получили валютные платежа от эмитента. \n\n<b>Держатели бумаг должны были получить платежи ещё 4 апреля, но из-за санкций США Минфин не смог осуществить выплаты. </b>\n\nВыплаты в рублях сочли за нарушение обязательств. \n\nЭто означает, что платежный агент выполнил поручения, и Россия может избежать дефолта.\n\n<a href=\"http://t.me/Alleconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Платежи по еврооблигациям выплачены! \n\nДержатели бумаг \"Россия-2022\" и \"Россия-2042\" получили валютные платежа от эмитента. \n\nДержатели бумаг должны были получить платежи ещё 4 апреля, но из-за санкций США Минфин не смог осуществить выплаты. \n\nВыплаты в рублях сочли за нарушение обязательств. \n\nЭто означает, что платежный агент выполнил поручения, и Россия может избежать дефолта.\n\nAll Economics",
  "publishedAt": "2022-05-03 07:29:55",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.1731038647342995
     ],
     [
      "bulgarian",
      0.16995169082125605
     ],
     [
      "macedonian",
      0.1092512077294685
     ]
    ]
   },
   "ner": [
    {
     "score": "1.213",
     "tag": "LOC",
     "entity": "США",
     "range": {
      "start": 33,
      "end": 33
     }
    },
    {
     "score": "0.742",
     "tag": "PERS",
     "entity": "Минфин",
     "range": {
      "start": 34,
      "end": 34
     }
    },
    {
     "score": "0.563",
     "tag": "LOC",
     "entity": "рублях",
     "range": {
      "start": 42,
      "end": 42
     }
    },
    {
     "score": "1.089",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 58,
      "end": 58
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9723065495491028,
     "__label__pos": 0.02771349810063839
    }
   }
  }
 },
 "md5": "c1b80c81f70ec5215322f9a74aca2d56",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:04 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Доходность 10-летних казначейских облигаций поднялась после повышения ставки ФРС на 50 базисных пунктов<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i></b>\n\nВ четверг <b>доходность</b> 10-летних казначейских <b>облигаций США</b> <b>выросла на 2.97%</b>, после того как  <b>Федеральная резервная система повысила процентные ставки на 50 базисных пунктов</b>, что стало крупнейшим повышением ставки за более чем два десятилетия.\nВ тоже время <b>доходность 30-летних казначейских</b> облигаций <b>выросла</b> <b>на 4 базисных пункта до 3,0498%.</b>\n\nФРС объявила о повышении базовой процентной ставки на полпроцентного пункта в среду во второй половине дня, что ознаменовало ее самое значительное повышение с 2000 года, но соответствовало ожиданиям рынка.\n\nЦентральный банк США также сообщил о своих планах начать сокращение своего баланса в июне.\n\n<i>Однако председатель ФРС Джером Пауэлл заявил, что повышение ставки на 75 базисных пунктов не является тем, что Федеральный комитет по открытым рынкам \"активно рассматривает\". Это привело к падению доходности 10-летних облигаций в среду днем.</i>\n\n<a href=\"http://t.me/Alleconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Доходность 10-летних казначейских облигаций поднялась после повышения ставки ФРС на 50 базисных пунктов \n\nВ четверг доходность 10-летних казначейских облигаций США выросла на 2.97%, после того как  Федеральная резервная система повысила процентные ставки на 50 базисных пунктов, что стало крупнейшим повышением ставки за более чем два десятилетия.\nВ тоже время доходность 30-летних казначейских облигаций выросла на 4 базисных пункта до 3,0498%.\n\nФРС объявила о повышении базовой процентной ставки на полпроцентного пункта в среду во второй половине дня, что ознаменовало ее самое значительное повышение с 2000 года, но соответствовало ожиданиям рынка.\n\nЦентральный банк США также сообщил о своих планах начать сокращение своего баланса в июне.\n\nОднако председатель ФРС Джером Пауэлл заявил, что повышение ставки на 75 базисных пунктов не является тем, что Федеральный комитет по открытым рынкам \"активно рассматривает\". Это привело к падению доходности 10-летних облигаций в среду днем.\n\nAll Economics",
  "publishedAt": "2022-05-05 12:40:28",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.21506666666666674
     ],
     [
      "bulgarian",
      0.18324444444444443
     ],
     [
      "macedonian",
      0.15475555555555554
     ]
    ]
   },
   "ner": [
    {
     "score": "0.915",
     "tag": "ORG",
     "entity": "ФРС",
     "range": {
      "start": 8,
      "end": 8
     }
    },
    {
     "score": "0.787",
     "tag": "LOC",
     "entity": "США",
     "range": {
      "start": 19,
      "end": 19
     }
    },
    {
     "score": "0.620",
     "tag": "ORG",
     "entity": "Федеральная резервная система",
     "range": {
      "start": 27,
      "end": 29
     }
    },
    {
     "score": "0.766",
     "tag": "ORG",
     "entity": "ФРС",
     "range": {
      "start": 64,
      "end": 64
     }
    },
    {
     "score": "0.741",
     "tag": "ORG",
     "entity": "ФРС",
     "range": {
      "start": 113,
      "end": 113
     }
    },
    {
     "score": "0.897",
     "tag": "PERS",
     "entity": "Джером Пауэлл",
     "range": {
      "start": 114,
      "end": 115
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.874652624130249,
     "__label__neg": 0.1253674030303955
    }
   }
  }
 },
 "md5": "c3199d5aa078b6a538ae5bb7976a017e",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:04 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Масштабное ралли S&amp;P 500, возможно, уже закончилось.</b>\n\nS&amp;P 500 ETF <b>взлетел</b> вверх после заседания ФРС 4 мая. В то время как <b>индекс VIX упал, а SPY подскочил,</b> что указывает на то, что ралли было больше <b>связано с падением уровней подразумеваемой волатильности</b>, чем с волнением по поводу плана ФРС, который никоим образом не является \"бычьим\" для акций.\n\nS&amp;P 500 ETF, скорее всего, увидит угасание этого ралли по многим причинам, в частности потому что на подходе важнейшие данные, такие как отчет о занятости в пятницу, 6 мая, и отчет об ИПЦ в среду, 11 мая. \n<i>Эти события, вероятно, будут оказывать давление на S&amp;P 500 ETF, поскольку инвесторы стремятся вернуть хеджирование на место, что приведет к повышению уровня подразумеваемой волатильности.</i>\n\n<a href=\"http://t.me/Alleconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Масштабное ралли S&P 500, возможно, уже закончилось.\n\nS&P 500 ETF взлетел вверх после заседания ФРС 4 мая. В то время как индекс VIX упал, а SPY подскочил, что указывает на то, что ралли было больше связано с падением уровней подразумеваемой волатильности, чем с волнением по поводу плана ФРС, который никоим образом не является \"бычьим\" для акций.\n\nS&P 500 ETF, скорее всего, увидит угасание этого ралли по многим причинам, в частности потому что на подходе важнейшие данные, такие как отчет о занятости в пятницу, 6 мая, и отчет об ИПЦ в среду, 11 мая. \nЭти события, вероятно, будут оказывать давление на S&P 500 ETF, поскольку инвесторы стремятся вернуть хеджирование на место, что приведет к повышению уровня подразумеваемой волатильности.\n\nAll Economics",
  "publishedAt": "2022-05-06 03:18:17",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2715777777777778
     ],
     [
      "bulgarian",
      0.18199999999999994
     ],
     [
      "macedonian",
      0.1713444444444444
     ]
    ]
   },
   "ner": [
    {
     "score": "0.795",
     "tag": "ORG",
     "entity": "S&P",
     "range": {
      "start": 2,
      "end": 2
     }
    },
    {
     "score": "0.911",
     "tag": "ORG",
     "entity": "S&P",
     "range": {
      "start": 9,
      "end": 9
     }
    },
    {
     "score": "0.641",
     "tag": "ORG",
     "entity": "ФРС",
     "range": {
      "start": 16,
      "end": 16
     }
    },
    {
     "score": "0.949",
     "tag": "ORG",
     "entity": "SPY",
     "range": {
      "start": 29,
      "end": 29
     }
    },
    {
     "score": "0.908",
     "tag": "ORG",
     "entity": "ФРС",
     "range": {
      "start": 54,
      "end": 54
     }
    },
    {
     "score": "0.661",
     "tag": "LOC",
     "entity": "ИПЦ в",
     "range": {
      "start": 105,
      "end": 106
     }
    },
    {
     "score": "0.733",
     "tag": "ORG",
     "entity": "S&P",
     "range": {
      "start": 121,
      "end": 121
     }
    },
    {
     "score": "0.590",
     "tag": "ORG",
     "entity": "инвесторы",
     "range": {
      "start": 126,
      "end": 126
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9107984900474548,
     "__label__neg": 0.08922148495912552
    }
   }
  }
 },
 "md5": "9031fd3f8149073c6ad721d227546af4",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:04 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Работа российских бирж 9–10 мая</b>\n\n<b>Мосбиржа:</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AA.png')\"><b>▪️</b></i><b>9–10 мая</b> — торги не проводятся.\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AA.png')\"><b>▪️</b></i><b>11–13 мая</b> — торги на фондовом, денежном, срочном, валютном рынке и рынке драгоценных металлов будут проводиться в официальные рабочие дни по действующему регламенту.\n\n<b> СПБ Биржа:</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E297BE.png')\"><b>◾️</b></i><b> 9–10 мая торги будут проводиться согласно утвержденному накануне расписанию торгов:</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AB.png')\"><b>▫️</b></i>Ценными бумагами иностранных эмитентов с листингом в США (с 14:30 МСК — ценными бумагами 50 международных компаний, с 15:00 МСК — ценными бумагами более 1600 международных компаний).\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AB.png')\"><b>▫️</b></i>акциями ПАО «СПБ Биржа» (c 10:00 МСК)\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AB.png')\"><b>▫️</b></i>паями ИПИФ «Индустрии будущего» и ЗПИФ «Фонд первичных размещений» (с 15:00 МСК).\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E297BE.png')\"><b>◾️</b></i><b>Торги не будут проводиться:</b>\n\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AB.png')\"><b>▫️</b></i>российскими ценными бумагами с валютой расчетов российский рубль\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AB.png')\"><b>▫️</b></i> депозитарными расписками на акции компаний Fix Price Group Ltd и TCS Group Holding PLC.",
  "text": "Работа российских бирж 9 10 мая\n\nМосбиржа:\n\n 9 10 мая   торги не проводятся.\n\n 11 13 мая   торги на фондовом, денежном, срочном, валютном рынке и рынке драгоценных металлов будут проводиться в официальные рабочие дни по действующему регламенту.\n\n СПБ Биржа:\n\n  9 10 мая торги будут проводиться согласно утвержденному накануне расписанию торгов:\n\n Ценными бумагами иностранных эмитентов с листингом в США (с 14:30 МСК   ценными бумагами 50 международных компаний, с 15:00 МСК   ценными бумагами более 1600 международных компаний).\n акциями ПАО «СПБ Биржа» (c 10:00 МСК)\n паями ИПИФ «Индустрии будущего» и ЗПИФ «Фонд первичных размещений» (с 15:00 МСК).\n\n Торги не будут проводиться:\n\n российскими ценными бумагами с валютой расчетов российский рубль\n  депозитарными расписками на акции компаний Fix Price Group Ltd и TCS Group Holding PLC.",
  "publishedAt": "2022-05-07 02:28:09",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.1458666666666666
     ],
     [
      "ukrainian",
      0.11695555555555548
     ],
     [
      "macedonian",
      0.11647777777777779
     ]
    ]
   },
   "ner": [
    {
     "score": "0.551",
     "tag": "PERS",
     "entity": "Мосбиржа",
     "range": {
      "start": 6,
      "end": 6
     }
    },
    {
     "score": "0.296",
     "tag": "ORG",
     "entity": "утвержденному",
     "range": {
      "start": 52,
      "end": 52
     }
    },
    {
     "score": "0.171",
     "tag": "PERS",
     "entity": "Ценными бумагами",
     "range": {
      "start": 57,
      "end": 58
     }
    },
    {
     "score": "1.345",
     "tag": "LOC",
     "entity": "США",
     "range": {
      "start": 64,
      "end": 64
     }
    },
    {
     "score": "0.483",
     "tag": "ORG",
     "entity": "ИПИФ",
     "range": {
      "start": 102,
      "end": 102
     }
    },
    {
     "score": "0.632",
     "tag": "ORG",
     "entity": "ЗПИФ",
     "range": {
      "start": 106,
      "end": 106
     }
    },
    {
     "score": "1.741",
     "tag": "ORG",
     "entity": "TCS Group Holding PLC",
     "range": {
      "start": 141,
      "end": 144
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9997304081916809,
     "__label__neg": 0.0002895516809076071
    }
   }
  }
 },
 "md5": "3b3390a37be1fbdd12d9840390feeb07",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:05 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Запрет ЕС на российскую нефть затормозился из-за требований Венгрии</b>\n\nВенгрия продолжает блокировать предложение Европейского союза о запрете импорта российской нефти, что задерживает весь пакет санкций блока, направленных против президента Владимира Путина из-за его войны в Украине. \n\nВстреча послов 27 стран ЕС завершилась в воскресенье без достижения соглашения, но ожидается, что переговоры возобновятся в ближайшие дни.\n\n<i>Запрет на поставки российской нефти в третьи страны также может быть отложен до тех пор, пока страны Группы семи не примут аналогичные меры. </i>\n\n<a href=\"http://t.me/alleconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Запрет ЕС на российскую нефть затормозился из-за требований Венгрии\n\nВенгрия продолжает блокировать предложение Европейского союза о запрете импорта российской нефти, что задерживает весь пакет санкций блока, направленных против президента Владимира Путина из-за его войны в Украине. \n\nВстреча послов 27 стран ЕС завершилась в воскресенье без достижения соглашения, но ожидается, что переговоры возобновятся в ближайшие дни.\n\nЗапрет на поставки российской нефти в третьи страны также может быть отложен до тех пор, пока страны Группы семи не примут аналогичные меры. \n\nAll Economics",
  "publishedAt": "2022-05-08 09:55:13",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.24406666666666665
     ],
     [
      "macedonian",
      0.1978333333333333
     ],
     [
      "bulgarian",
      0.18966666666666665
     ]
    ]
   },
   "ner": [
    {
     "score": "1.077",
     "tag": "ORG",
     "entity": "ЕС",
     "range": {
      "start": 1,
      "end": 1
     }
    },
    {
     "score": "1.033",
     "tag": "LOC",
     "entity": "Венгрии",
     "range": {
      "start": 8,
      "end": 8
     }
    },
    {
     "score": "0.723",
     "tag": "ORG",
     "entity": "Европейского союза о",
     "range": {
      "start": 13,
      "end": 15
     }
    },
    {
     "score": "0.457",
     "tag": "ORG",
     "entity": "блока",
     "range": {
      "start": 26,
      "end": 26
     }
    },
    {
     "score": "1.262",
     "tag": "PERS",
     "entity": "Владимира Путина",
     "range": {
      "start": 31,
      "end": 32
     }
    },
    {
     "score": "1.392",
     "tag": "LOC",
     "entity": "Украине",
     "range": {
      "start": 37,
      "end": 37
     }
    },
    {
     "score": "0.950",
     "tag": "ORG",
     "entity": "ЕС",
     "range": {
      "start": 43,
      "end": 43
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9397879242897034,
     "__label__pos": 0.06023203209042549
    }
   }
  }
 },
 "md5": "29c560aad38cbe8b4004261bc1a717d9",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:05 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Даже за пределами Америки инфляция начинает выглядеть укоренившейся <i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F938A.png')\"><b>📊</b></i></b>\n\n<b>Пять показателей свидетельствуют о том, что больше всего страдают англоязычные страны</b>\n\n<b>Инфляция</b> <b>доминирует </b>в психике американского населения в такой степени, какой не наблюдалось с 1980-х годов, когда цены в последний раз росли такими темпами. \n\nСогласно данным, опубликованным 11 мая, <b>потребительские цены в апреле выросли на 8,3%</b> по сравнению с предыдущим годом. \nДнем ранее президент Джо Байден назвал борьбу с инфляцией своим \"<b>главным внутренним приоритетом</b>\". Американцы считают инфляцию большей проблемой для своей страны, чем война в Украине. \n\n<b>Журнал The Economist собрал данные по пяти показателям в десяти крупных экономиках:</b> \n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AA.png')\"><b>▪️</b></i>\"базовая\" инфляция, которая не включает цены на продукты питания и энергоносители\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AA.png')\"><b>▪️</b></i>разброс в темпах инфляции по субкомпонентам индекса потребительских цен\n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AA.png')\"><b>▪️</b></i> стоимость рабочей силы \n<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/E296AA.png')\"><b>▪️</b></i>инфляционные ожидания; и поиск инфляции в Google. \n\nКонтинентальная Европа, по крайней мере, до сих пор, кажется, избежала худшего бедствия. Инфляция практически не оставляет следов в Японии . В Канаде дела обстоят немного хуже даже, чем в Америке. У Британии большие проблемы\n\n<i>По нашим оценкам, общее фискальное стимулирование в англоязычных странах в 2020–2021 годах было примерно на 40% более щедрым, чем в других богатых странах.</i>\n\n<a href=\"http://t.me/Alleconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Даже за пределами Америки инфляция начинает выглядеть укоренившейся  \n\nПять показателей свидетельствуют о том, что больше всего страдают англоязычные страны\n\nИнфляция доминирует в психике американского населения в такой степени, какой не наблюдалось с 1980-х годов, когда цены в последний раз росли такими темпами. \n\nСогласно данным, опубликованным 11 мая, потребительские цены в апреле выросли на 8,3% по сравнению с предыдущим годом. \nДнем ранее президент Джо Байден назвал борьбу с инфляцией своим \"главным внутренним приоритетом\". Американцы считают инфляцию большей проблемой для своей страны, чем война в Украине. \n\nЖурнал The Economist собрал данные по пяти показателям в десяти крупных экономиках: \n \"базовая\" инфляция, которая не включает цены на продукты питания и энергоносители\n разброс в темпах инфляции по субкомпонентам индекса потребительских цен\n  стоимость рабочей силы \n инфляционные ожидания; и поиск инфляции в Google. \n\nКонтинентальная Европа, по крайней мере, до сих пор, кажется, избежала худшего бедствия. Инфляция практически не оставляет следов в Японии . В Канаде дела обстоят немного хуже даже, чем в Америке. У Британии большие проблемы\n\nПо нашим оценкам, общее фискальное стимулирование в англоязычных странах в 2020 2021 годах было примерно на 40% более щедрым, чем в других богатых странах.\n\nAll Economics",
  "publishedAt": "2022-05-14 03:45:02",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.30746666666666667
     ],
     [
      "bulgarian",
      0.22864444444444443
     ],
     [
      "macedonian",
      0.18545555555555548
     ]
    ]
   },
   "ner": [
    {
     "score": "0.960",
     "tag": "LOC",
     "entity": "Америки",
     "range": {
      "start": 3,
      "end": 3
     }
    },
    {
     "score": "0.222",
     "tag": "ORG",
     "entity": "Инфляция",
     "range": {
      "start": 20,
      "end": 20
     }
    },
    {
     "score": "1.040",
     "tag": "PERS",
     "entity": "Джо Байден",
     "range": {
      "start": 69,
      "end": 70
     }
    },
    {
     "score": "1.386",
     "tag": "LOC",
     "entity": "Украине",
     "range": {
      "start": 94,
      "end": 94
     }
    },
    {
     "score": "0.979",
     "tag": "ORG",
     "entity": "Журнал The Economist",
     "range": {
      "start": 96,
      "end": 98
     }
    },
    {
     "score": "0.916",
     "tag": "ORG",
     "entity": "Google",
     "range": {
      "start": 141,
      "end": 141
     }
    },
    {
     "score": "1.327",
     "tag": "LOC",
     "entity": "Японии",
     "range": {
      "start": 166,
      "end": 166
     }
    },
    {
     "score": "0.795",
     "tag": "LOC",
     "entity": "Канаде",
     "range": {
      "start": 169,
      "end": 169
     }
    },
    {
     "score": "0.960",
     "tag": "LOC",
     "entity": "Америке",
     "range": {
      "start": 178,
      "end": 178
     }
    },
    {
     "score": "0.821",
     "tag": "LOC",
     "entity": "Британии",
     "range": {
      "start": 181,
      "end": 181
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.5662792325019836,
     "__label__neg": 0.4337408244609833
    }
   }
  }
 },
 "md5": "fa1c790c0d4f9625b6eeb3697b7dcd7b",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:05 -> {
 "type": "telegram",
 "url": "https://t.me/AllEconomics",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@AllEconomics",
   "title": "All Economics",
   "description": "<i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F9388.png')\"><b>📈</b></i>Канал об интересном и важном из мира инвестиций и экономики.<br><br><i class=\"emoji\" style=\"background-image:url('//telegram.org/img/emoji/40/F09F93B2.png')\"><b>📲</b></i>По рекламе и сотрудничеству -  <a href=\"https://t.me/DenisBulgac\" target=\"_blank\">@DenisBulgac</a>, <a href=\"https://t.me/VBogdanV\" target=\"_blank\">@VBogdanV</a> (оплата)",
   "image": "https://cdn4.telegram-cdn.org/file/faaUTaW9ZzBoMTI00pIGhoe8-AXFRgdum-uLspyn8qYYNXoNUia45mWCMV4XWy9wC3x4E3uZKoMgqQ0FejRJaZNbNIQbaknYZJMqh01Ej5Qp_0wkq0cMBPzXkid18IlrGfLhHpaQc9-PK_9TYJDVNGHRHANWSF4J98G6Tln5ykFZbgkyyBKaZEcMyTOS1ve63vJop2Rwq-uczTfMcOuoZ5u1YK13SeDL0di5Qsc7m3eqGfjABJcI2vU2DAjuQFBu8pd_ndABO8IVWAxxnRrfJo-0wYFuoRi_CvzZbosgiQ6wT0wI4_8bo_qwQbfSSQRHLCRsKxjBsJv0chV33XnwXQ.jpg"
  },
  "html": "<b>Основатель FTX считает, что у биткоина нет будущего в качестве платежной сети</b>\n\n<b>Основатель криптовалютной биржи FTX заявил</b>, что у биткоина нет будущего в качестве платежной сети, и раскритиковал цифровую валюту за ее неэффективность и высокие экологические затраты, сообщила в понедельник газета Financial Times.\n\n<b>Биткоин</b>, крупнейшая в мире криптовалюта, создается с помощью процесса, называемого <b>\"доказательство работы\"</b>, который требует, чтобы компьютеры \"добывали\" валюту, решая сложные головоломки. Для питания этих компьютеров требуется большое количество электроэнергии.\n\n<b>Альтернатива этой системе</b> называется сетью <b>\"доказательство доли\"</b>, где участники могут купить токены, которые позволяют им присоединиться к сети. Чем больше токенов они имеют, тем больше они могут добывать.\n\n<i>Основатель и исполнительный директор FTX Сэм Банкман-Фрид сказал FT, что сети \"proof of stake\" потребуются для развития криптовалют в качестве платежной сети, поскольку они дешевле и менее энергозатратны.</i>\n\n<a href=\"http://t.me/Alleconomics\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">All Economics</a>",
  "text": "Основатель FTX считает, что у биткоина нет будущего в качестве платежной сети\n\nОснователь криптовалютной биржи FTX заявил, что у биткоина нет будущего в качестве платежной сети, и раскритиковал цифровую валюту за ее неэффективность и высокие экологические затраты, сообщила в понедельник газета Financial Times.\n\nБиткоин, крупнейшая в мире криптовалюта, создается с помощью процесса, называемого \"доказательство работы\", который требует, чтобы компьютеры \"добывали\" валюту, решая сложные головоломки. Для питания этих компьютеров требуется большое количество электроэнергии.\n\nАльтернатива этой системе называется сетью \"доказательство доли\", где участники могут купить токены, которые позволяют им присоединиться к сети. Чем больше токенов они имеют, тем больше они могут добывать.\n\nОснователь и исполнительный директор FTX Сэм Банкман-Фрид сказал FT, что сети \"proof of stake\" потребуются для развития криптовалют в качестве платежной сети, поскольку они дешевле и менее энергозатратны.\n\nAll Economics",
  "publishedAt": "2022-05-17 09:57:07",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.24317777777777783
     ],
     [
      "bulgarian",
      0.18830000000000002
     ],
     [
      "macedonian",
      0.1428222222222223
     ]
    ]
   },
   "ner": [
    {
     "score": "0.601",
     "tag": "ORG",
     "entity": "FTX",
     "range": {
      "start": 1,
      "end": 1
     }
    },
    {
     "score": "0.238",
     "tag": "LOC",
     "entity": "биржи",
     "range": {
      "start": 15,
      "end": 15
     }
    },
    {
     "score": "0.966",
     "tag": "ORG",
     "entity": "газета Financial Times",
     "range": {
      "start": 44,
      "end": 46
     }
    },
    {
     "score": "0.539",
     "tag": "ORG",
     "entity": "головоломки",
     "range": {
      "start": 78,
      "end": 78
     }
    },
    {
     "score": "1.036",
     "tag": "PERS",
     "entity": "Сэм Банкман-Фрид",
     "range": {
      "start": 129,
      "end": 130
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9923527836799622,
     "__label__neg": 0.007667254656553268
    }
   }
  }
 },
 "md5": "bac6f1ef6523e6faa914da5bf271c5e8",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:05 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "и тут писала про хороших русских!",
  "text": "и тут писала про хороших русских!",
  "publishedAt": "2022-05-20 03:26:12",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.19311827956989247
     ],
     [
      "ukrainian",
      0.19193548387096782
     ],
     [
      "serbian",
      0.18591397849462366
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000100135803223,
     "__label__neg": 0.000010002044291468337
    }
   }
  }
 },
 "md5": "147344b8df51f91296073278a6e16cb4",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:05 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Любо-дорого читать, как люди, столько лет старавшиеся быть правильными русскими на приставных стульчиках, выслуживающимися перед неоколониальными хозяевами, которых сами себе назначили и которым ни нахрен не сдались, вдруг задаются вопросом:   А может быть…",
  "text": "Любо-дорого читать, как люди, столько лет старавшиеся быть правильными русскими на приставных стульчиках, выслуживающимися перед неоколониальными хозяевами, которых сами себе назначили и которым ни нахрен не сдались, вдруг задаются вопросом:   А может быть А еще вот тут я писала про «хороших русских»!",
  "publishedAt": "2022-05-20 03:27:00",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.26665277777777774
     ],
     [
      "bulgarian",
      0.16631944444444446
     ],
     [
      "ukrainian",
      0.16356944444444443
     ]
    ]
   },
   "ner": [
    {
     "score": "0.479",
     "tag": "PERS",
     "entity": "А",
     "range": {
      "start": 39,
      "end": 39
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9978644251823425,
     "__label__neg": 0.002155513735488057
    }
   }
  }
 },
 "md5": "4a98fef7252ab6bcd110560115a054cd",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:06 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Меня никто не насиловал, так что и изнасилований нет никаких. Всё это провокация Маргариты Симоньян!  https://t.me/NoodleRemoverPlus/2338  ВЕСТИ СЕБЯ НАДО ЛУЧШЕ, НАДО БЫТЬ ПРАВИЛЬНЫМ РУССКИМ! Тогда и приставной стульчик для правильных русских дадут!",
  "text": "Меня никто не насиловал, так что и изнасилований нет никаких. Всё это провокация Маргариты Симоньян!  https://t.me/NoodleRemoverPlus/2338  ВЕСТИ СЕБЯ НАДО ЛУЧШЕ, НАДО БЫТЬ ПРАВИЛЬНЫМ РУССКИМ! Тогда и приставной стульчик для правильных русских дадут!И тут, и тут!",
  "publishedAt": "2022-05-20 03:28:52",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.22676616915422887
     ],
     [
      "bulgarian",
      0.19424543946932005
     ],
     [
      "serbian",
      0.16655058043117743
     ]
    ]
   },
   "ner": [
    {
     "score": "0.498",
     "tag": "ORG",
     "entity": "НАДО",
     "range": {
      "start": 28,
      "end": 28
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__neg": 0.6685703992843628,
     "__label__pos": 0.3314496874809265
    }
   }
  }
 },
 "md5": "df2375fed1c49d55fc66f1428e96a9de",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:06 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "У меня отдельная боль с засуспенженным твиттором — это что же как же теперь. Вот вдруг меня опять однажды позовут на какую международную конференцию по Борьбе Бобра с Ослом, в качестве разрешенного русского на приставном стульчике. И раньше у меня была маленькая…",
  "text": "У меня отдельная боль с засуспенженным твиттором   это что же как же теперь. Вот вдруг меня опять однажды позовут на какую международную конференцию по Борьбе Бобра с Ослом, в качестве разрешенного русского на приставном стульчике. И раньше у меня была маленькая А тут вот был период, когда у меня отняли звание хорошего русского и выдали звание плохого русского",
  "publishedAt": "2022-05-20 03:29:54",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.22016169154228848
     ],
     [
      "bulgarian",
      0.17324626865671644
     ],
     [
      "macedonian",
      0.15182835820895524
     ]
    ]
   },
   "ner": [
    {
     "score": "0.436",
     "tag": "PERS",
     "entity": "Борьбе Бобра",
     "range": {
      "start": 25,
      "end": 26
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9976362586021423,
     "__label__neg": 0.0023838256020098925
    }
   }
  }
 },
 "md5": "1df7b0b6f36ce8de712da94e7e8dbd68",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:06 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "В общем, давно уж пишу я про этот сюжет о получении ксивы «Хорошего русского» разными людьми, рассуждающими о том, что кто-то где-то пресмыкается перед царем и сами занятыми ровно тем же у других господ. \n\nНу, отрадно видеть, что теперь гораздо больше людей понимают о чем же я так давно говорю.",
  "text": "В общем, давно уж пишу я про этот сюжет о получении ксивы «Хорошего русского» разными людьми, рассуждающими о том, что кто-то где-то пресмыкается перед царем и сами занятыми ровно тем же у других господ. \n\nНу, отрадно видеть, что теперь гораздо больше людей понимают о чем же я так давно говорю.",
  "publishedAt": "2022-05-20 03:33:53",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.23222695035460994
     ],
     [
      "serbian",
      0.1535177304964539
     ],
     [
      "ukrainian",
      0.14710638297872336
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9900498986244202,
     "__label__neg": 0.00997016578912735
    }
   }
  }
 },
 "md5": "9253bbb3671478f588562893c811009c",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:06 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "После того, как Россия начала войну, против России тоже начали войну и теперь все русские под угрозой.\n\nРазве можно было такое представить? Лично я бы никогда не могла такое представить!\n\n<a href=\"https://t.me/readovkanews/34449\" target=\"_blank\" rel=\"noopener\">https://t.me/readovkanews/34449</a>",
  "text": "После того, как Россия начала войну, против России тоже начали войну и теперь все русские под угрозой.\n\nРазве можно было такое представить? Лично я бы никогда не могла такое представить!\n\nhttps://t.me/readovkanews/34449",
  "publishedAt": "2022-05-21 09:07:55",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.24727810650887572
     ],
     [
      "bulgarian",
      0.18729783037475345
     ],
     [
      "serbian",
      0.17609467455621308
     ]
    ]
   },
   "ner": [
    {
     "score": "1.067",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 4,
      "end": 4
     }
    },
    {
     "score": "1.419",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 9,
      "end": 9
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9992867112159729,
     "__label__pos": 0.0007332871318794787
    }
   }
  }
 },
 "md5": "dd0fd19be821a9398d3464b75b0b3530",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:06 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Представители фонда борьбы с коррупцией пытаются оправдываться и ищут несуществующие доказательства поддержки войны с моей стороны.\nВ своем сегодняшнем заявлении они в качестве аргументов против меня приводят, во-первых, статью 2014 года, в которой прямо говорится о недопустимости войны, во-вторых - твит со смешной чужой цитатой (как известно, мой твиттер в основном и состоял из чужих смешных цитат) и две реплики, непонятные вне контекста.\nЭтот эпизод доказывает, что сведение личных счетов под видом борьбы за мир дискредитирует прежде всего самих ФБК-шников.\nЯ по-прежнему, как и всегда с 2014 года, открыто и четко <a href=\"https://republic.ru/posts/103899\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">выступаю </a> против путинской агрессии и рассчитываю на публичные извинения передо мной со стороны Волкова, Жданова и других.",
  "text": "Представители фонда борьбы с коррупцией пытаются оправдываться и ищут несуществующие доказательства поддержки войны с моей стороны.\nВ своем сегодняшнем заявлении они в качестве аргументов против меня приводят, во-первых, статью 2014 года, в которой прямо говорится о недопустимости войны, во-вторых - твит со смешной чужой цитатой (как известно, мой твиттер в основном и состоял из чужих смешных цитат) и две реплики, непонятные вне контекста.\nЭтот эпизод доказывает, что сведение личных счетов под видом борьбы за мир дискредитирует прежде всего самих ФБК-шников.\nЯ по-прежнему, как и всегда с 2014 года, открыто и четко выступаю  против путинской агрессии и рассчитываю на публичные извинения передо мной со стороны Волкова, Жданова и других.",
  "publishedAt": "2022-05-20 06:08:25",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.25446666666666673
     ],
     [
      "bulgarian",
      0.21391111111111116
     ],
     [
      "macedonian",
      0.17598888888888886
     ]
    ]
   },
   "ner": [
    {
     "score": "0.416",
     "tag": "LOC",
     "entity": "коррупцией",
     "range": {
      "start": 4,
      "end": 4
     }
    },
    {
     "score": "0.227",
     "tag": "PERS",
     "entity": "ФБК-шников",
     "range": {
      "start": 90,
      "end": 90
     }
    },
    {
     "score": "0.959",
     "tag": "PERS",
     "entity": "Волкова",
     "range": {
      "start": 118,
      "end": 118
     }
    },
    {
     "score": "0.980",
     "tag": "PERS",
     "entity": "Жданова",
     "range": {
      "start": 120,
      "end": 120
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9999724626541138,
     "__label__pos": 0.00004751577944261953
    }
   }
  }
 },
 "md5": "1ac9d65abd07a58e3a8810372be39927",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:06 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "А это, видимо, анонс инициативы паспорта «плохого русского»!\n\n<a href=\"https://t.me/kshulika/49902\" target=\"_blank\" rel=\"noopener\">https://t.me/kshulika/49902</a>",
  "text": "А это, видимо, анонс инициативы паспорта «плохого русского»!\n\nhttps://t.me/kshulika/49902",
  "publishedAt": "2022-05-20 06:27:56",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.12251028806584352
     ],
     [
      "ukrainian",
      0.10106995884773673
     ],
     [
      "macedonian",
      0.09053497942386834
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000100135803223,
     "__label__neg": 0.000010008456229115836
    }
   }
  }
 },
 "md5": "3b1482ed15a057f6059e7d9c440622af",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:07 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "За всеми этими сводками об очередных уголовных делах, обысках, задержаниях мы совсем забываем про людей. Про тех самых \"фигурантов уголовных дел\", которых наше государство прессует и не всегда даже понятно за что. Привыкли, согласен. Но, ребят, у \"фигуранта\" человеческое лицо.\n\nПеред днем Победы стало известно про дело \"Весны\". Они призывали к антивоенным акциям 9 мая. Государство считает ребят-оппозиционеров опасными для госстроя и граждан. В итоге к празднику прошло не менее семи обысков у тех самых фигурантов. \n\nОдна из них - Ангелина Рощупко. Следствие пытается назначить ее координатором движение, про которое она и узнала-то несколько месяцев назад, да и в акциях их не участвовала. А еще ее запугивали и пытались заставить стучать. Не вышло. \n\nТакая вот призрачная \"Весна\". Почитайте.\n\n<a href=\"https://ostorozhno.media/vesna/\" target=\"_blank\" rel=\"noopener\">https://ostorozhno.media/vesna/</a>",
  "text": "За всеми этими сводками об очередных уголовных делах, обысках, задержаниях мы совсем забываем про людей. Про тех самых \"фигурантов уголовных дел\", которых наше государство прессует и не всегда даже понятно за что. Привыкли, согласен. Но, ребят, у \"фигуранта\" человеческое лицо.\n\nПеред днем Победы стало известно про дело \"Весны\". Они призывали к антивоенным акциям 9 мая. Государство считает ребят-оппозиционеров опасными для госстроя и граждан. В итоге к празднику прошло не менее семи обысков у тех самых фигурантов. \n\nОдна из них - Ангелина Рощупко. Следствие пытается назначить ее координатором движение, про которое она и узнала-то несколько месяцев назад, да и в акциях их не участвовала. А еще ее запугивали и пытались заставить стучать. Не вышло. \n\nТакая вот призрачная \"Весна\". Почитайте.\n\nhttps://ostorozhno.media/vesna/",
  "publishedAt": "2022-05-20 08:39:52",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.2796222222222222
     ],
     [
      "bulgarian",
      0.20919999999999994
     ],
     [
      "macedonian",
      0.18365555555555557
     ]
    ]
   },
   "ner": [
    {
     "score": "0.150",
     "tag": "PERS",
     "entity": "Весны",
     "range": {
      "start": 62,
      "end": 62
     }
    },
    {
     "score": "0.509",
     "tag": "PERS",
     "entity": "Ангелина Рощупко",
     "range": {
      "start": 100,
      "end": 101
     }
    }
   ],
   "sentiments": {
    "emotion": "negative",
    "classes": {
     "__label__neg": 0.9857614636421204,
     "__label__pos": 0.014258488081395626
    }
   }
  }
 },
 "md5": "0e47c86b8a6f4951609dd4af840152c1",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:07 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "<i>Рядом с гостиницей на скамеечке сидит дед. Хочу закурить, спрашиваю разрешения на всякий случай. \n\n— Садись рядом, закуривай, не стесняйся. Я 14 лет как бросил, но дымок люблю, мне не мешает, — говорит дедушка со скамейки. \n\nСажусь, закуриваю. Говорю, мол, погода хорошая. \n\n— Да и зима теплая была. Ну, у нас, — отвечает.\n\n— А у вас — это где?\n\n— Так в Изюме. Это недалеко тут. Да и сейчас там хорошо. Плохо вернее. Но тепло уже.\n\n— Да уж…\n\n— А вы украинец? — спрашивает дедушка. \n\n— Нет, — говорю, — я с Севера сам, а сейчас из Москвы приехал.\n\n— Ну там холодно, наверное. \n\n— А как там у вас вообще было в последнее время? — спрашиваю. \n\n— Да как-как? Плохо было. Два месяца в подвале ночевали. Иногда и днем не выходили. Вот тут помылся нормально в первый раз с начала *****. Я, кстати, Валентин.\n\n— Алексей. Приятно познакомиться.\n\nВ этот момент с вокзала доносится грохот — вагоны перецепляют. Дед Валентин резко, насколько это возможно для старика с палочкой, дергается и собирается куда-то прятаться. \n\n— Б****, подумал: бомбежка, — смеется дед несколько секунд. \n\nА потом начинает беззвучно плакать.\n</i>\nНаш журналист Алексей Полоротов съездил в Белгородскую область на границу с Украиной и написал оттуда репортаж.\n\n<a href=\"https://ostorozhno.media/razve-chto-na-nebo-pochashhe-posmatrivaem-reportazh-iz-belgoroda-kotoryj-regulyarno-bombyat-s-ukrainy/\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\"><b>Прочитайте.</b></a>",
  "text": "Рядом с гостиницей на скамеечке сидит дед. Хочу закурить, спрашиваю разрешения на всякий случай. \n\n  Садись рядом, закуривай, не стесняйся. Я 14 лет как бросил, но дымок люблю, мне не мешает,   говорит дедушка со скамейки. \n\nСажусь, закуриваю. Говорю, мол, погода хорошая. \n\n  Да и зима теплая была. Ну, у нас,   отвечает.\n\n  А у вас   это где?\n\n  Так в Изюме. Это недалеко тут. Да и сейчас там хорошо. Плохо вернее. Но тепло уже.\n\n  Да уж \n\n  А вы украинец?   спрашивает дедушка. \n\n  Нет,   говорю,   я с Севера сам, а сейчас из Москвы приехал.\n\n  Ну там холодно, наверное. \n\n  А как там у вас вообще было в последнее время?   спрашиваю. \n\n  Да как-как? Плохо было. Два месяца в подвале ночевали. Иногда и днем не выходили. Вот тут помылся нормально в первый раз с начала *****. Я, кстати, Валентин.\n\n  Алексей. Приятно познакомиться.\n\nВ этот момент с вокзала доносится грохот   вагоны перецепляют. Дед Валентин резко, насколько это возможно для старика с палочкой, дергается и собирается куда-то прятаться. \n\n  Б****, подумал: бомбежка,   смеется дед несколько секунд. \n\nА потом начинает беззвучно плакать.\n\nНаш журналист Алексей Полоротов съездил в Белгородскую область на границу с Украиной и написал оттуда репортаж.\n\nПрочитайте.",
  "publishedAt": "2022-05-20 09:49:33",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.27441111111111105
     ],
     [
      "bulgarian",
      0.21131111111111112
     ],
     [
      "macedonian",
      0.20406666666666662
     ]
    ]
   },
   "ner": [
    {
     "score": "1.297",
     "tag": "LOC",
     "entity": "Москвы",
     "range": {
      "start": 116,
      "end": 116
     }
    },
    {
     "score": "0.780",
     "tag": "PERS",
     "entity": "Валентин",
     "range": {
      "start": 171,
      "end": 171
     }
    },
    {
     "score": "0.471",
     "tag": "PERS",
     "entity": "Алексей .",
     "range": {
      "start": 173,
      "end": 174
     }
    },
    {
     "score": "0.901",
     "tag": "PERS",
     "entity": "Алексей Полоротов",
     "range": {
      "start": 225,
      "end": 226
     }
    },
    {
     "score": "1.014",
     "tag": "LOC",
     "entity": "Белгородскую область",
     "range": {
      "start": 229,
      "end": 230
     }
    },
    {
     "score": "0.943",
     "tag": "LOC",
     "entity": "Украиной",
     "range": {
      "start": 234,
      "end": 234
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.8838077783584595,
     "__label__neg": 0.11621227115392685
    }
   }
  }
 },
 "md5": "f37460c8050f0d64a52ff177b78fb81d",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Хочется как-то высказаться в защиту <a href=\"https://t.me/kashinplus\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Олега Кашина</a> от тех мудаков из осколков ФБК, которые составляют списки «разжигателей войны», «кремлевских пропагандистов» и так далее. Кто не следил – Волков и компания засунули Олега в свой «санкционный список». При этом очевидно, что Олег никакой не «кремлевский пропагандист» -- напротив, он годами постоянно и последовательно критиковал Кремль. Но только параллельно он критиковал еще и навальнистов – и вот этого они ему простить никак не могут (у меня на эту тему был подробный разбор ещё в 2020 году <a href=\"https://t.me/Crexcrexcrex/2039\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">1</a>,<a href=\"https://t.me/Crexcrexcrex/2040\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">2</a>)\n\nВ общем, Олег пошел на принцип и собрал <a href=\"https://republic.ru/posts/103899\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">список</a> из 32 своих статей – начиная с 2014 года. Если их прочитать, то становится понятно, как на самом деле он относится и к Кремлю, и к войне (сначала возможной потом, увы, реальной). Навальнисты, разумеется, читать их не стали. Потому что пришлось бы извиняться и признавать свою ошибку – а «пацаны заднюю не включают», как когда-то написал Лошак про Кремль. \nИ навальнисты [не в первый раз] продемонстрировали типично «кремлевское» поведение. <a href=\"https://twitter.com/fbkinfo/status/1527653158406733825?s=28&amp;t=EJ_SGLpQbDYx3zIxFvbGxA\" target=\"_blank\" rel=\"noopener\" onclick=\"return confirm('Open this link?\\n\\n'+this.href);\">Написали</a>, что 32 статьи (а также бесчисленное количество радиопередач и и стримов) за 8 лет ничего не значат, ведь они нашли у Олега аж ЧЕТЫРЕ ПУБЛИКАЦИИ в поддержку войны.\n\nИз которых одна – это твит с цитатой какого-то мудака, вторая – абсолютно антивоенная колонка, а третья и четвертая –  личные твиты Олега, вырванные из контекста. \n\nДа даже если бы и не вырванные. Вся эта ситуация выглядит как типичная «кремлевская» стратегия по отношению к самим навальнистам. «Нечего предъявить Навальному? Ну как же, вон он что-то в ролике сказал. Давайте возьмём цитату и обвиним его в оскорблении ветерана». Так и тут.  Представляю, как Лёня Волков требует от подчинённых: «Ищите, ищите, должен же был Кашин что-то такое сказать, что подтвердит наши слова. Мы же не можем признать, что были неправы! Ищите лучше! Что, написал пьяный твит про русский Львов? Ну всё, отлично, этого хватит, скажем европейцам, что он разжигатель войны».\n\nТо есть, составители списков из ФБК ведут себя буквально так же, как блогер Илья Ремесло, строчивший заявы на слова Навального. Или как Роскомнадзор, который судит людей за их личное мнение в личных твитах.\n\nНу и мудаки, что тут сказать.",
  "text": "Хочется как-то высказаться в защиту Олега Кашина от тех мудаков из осколков ФБК, которые составляют списки «разжигателей войны», «кремлевских пропагандистов» и так далее. Кто не следил   Волков и компания засунули Олега в свой «санкционный список». При этом очевидно, что Олег никакой не «кремлевский пропагандист» -- напротив, он годами постоянно и последовательно критиковал Кремль. Но только параллельно он критиковал еще и навальнистов   и вот этого они ему простить никак не могут (у меня на эту тему был подробный разбор ещё в 2020 году 1,2)\n\nВ общем, Олег пошел на принцип и собрал список из 32 своих статей   начиная с 2014 года. Если их прочитать, то становится понятно, как на самом деле он относится и к Кремлю, и к войне (сначала возможной потом, увы, реальной). Навальнисты, разумеется, читать их не стали. Потому что пришлось бы извиняться и признавать свою ошибку   а «пацаны заднюю не включают», как когда-то написал Лошак про Кремль. \nИ навальнисты [не в первый раз] продемонстрировали типично «кремлевское» поведение. Написали, что 32 статьи (а также бесчисленное количество радиопередач и и стримов) за 8 лет ничего не значат, ведь они нашли у Олега аж ЧЕТЫРЕ ПУБЛИКАЦИИ в поддержку войны.\n\nИз которых одна   это твит с цитатой какого-то мудака, вторая   абсолютно антивоенная колонка, а третья и четвертая    личные твиты Олега, вырванные из контекста. \n\nДа даже если бы и не вырванные. Вся эта ситуация выглядит как типичная «кремлевская» стратегия по отношению к самим навальнистам. «Нечего предъявить Навальному? Ну как же, вон он что-то в ролике сказал. Давайте возьмём цитату и обвиним его в оскорблении ветерана». Так и тут.  Представляю, как Лёня Волков требует от подчинённых: «Ищите, ищите, должен же был Кашин что-то такое сказать, что подтвердит наши слова. Мы же не можем признать, что были неправы! Ищите лучше! Что, написал пьяный твит про русский Львов? Ну всё, отлично, этого хватит, скажем европейцам, что он разжигатель войны».\n\nТо есть, составители списков из ФБК ведут себя буквально так же, как блогер Илья Ремесло, строчивший заявы на слова Навального. Или как Роскомнадзор, который судит людей за их личное мнение в личных твитах.\n\nНу и мудаки, что тут сказать.",
  "publishedAt": "2022-05-20 09:52:20",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.3411444444444445
     ],
     [
      "bulgarian",
      0.2636222222222222
     ],
     [
      "serbian",
      0.20594444444444449
     ]
    ]
   },
   "ner": [
    {
     "score": "0.514",
     "tag": "PERS",
     "entity": "Олега Кашина",
     "range": {
      "start": 5,
      "end": 6
     }
    },
    {
     "score": "0.508",
     "tag": "PERS",
     "entity": "Волков",
     "range": {
      "start": 29,
      "end": 29
     }
    },
    {
     "score": "1.077",
     "tag": "ORG",
     "entity": "компания засунули Олега в",
     "range": {
      "start": 31,
      "end": 34
     }
    },
    {
     "score": "0.444",
     "tag": "LOC",
     "entity": "«санкционный",
     "range": {
      "start": 36,
      "end": 36
     }
    },
    {
     "score": "0.864",
     "tag": "PERS",
     "entity": "Олег",
     "range": {
      "start": 44,
      "end": 44
     }
    },
    {
     "score": "0.318",
     "tag": "LOC",
     "entity": "Кремль",
     "range": {
      "start": 58,
      "end": 58
     }
    },
    {
     "score": "1.419",
     "tag": "PERS",
     "entity": "Олег",
     "range": {
      "start": 95,
      "end": 95
     }
    },
    {
     "score": "0.584",
     "tag": "PERS",
     "entity": "Лошак",
     "range": {
      "start": 169,
      "end": 169
     }
    },
    {
     "score": "0.745",
     "tag": "LOC",
     "entity": "Кремль",
     "range": {
      "start": 171,
      "end": 171
     }
    },
    {
     "score": "0.108",
     "tag": "PERS",
     "entity": "Олега",
     "range": {
      "start": 212,
      "end": 212
     }
    },
    {
     "score": "0.689",
     "tag": "ORG",
     "entity": "ЧЕТЫРЕ",
     "range": {
      "start": 214,
      "end": 214
     }
    },
    {
     "score": "0.618",
     "tag": "ORG",
     "entity": "ПУБЛИКАЦИИ",
     "range": {
      "start": 215,
      "end": 215
     }
    },
    {
     "score": "0.514",
     "tag": "PERS",
     "entity": "Олега",
     "range": {
      "start": 241,
      "end": 241
     }
    },
    {
     "score": "0.511",
     "tag": "ORG",
     "entity": "ситуация",
     "range": {
      "start": 257,
      "end": 257
     }
    },
    {
     "score": "0.480",
     "tag": "PERS",
     "entity": "Навальному",
     "range": {
      "start": 271,
      "end": 271
     }
    },
    {
     "score": "0.808",
     "tag": "PERS",
     "entity": "Лёня Волков",
     "range": {
      "start": 301,
      "end": 302
     }
    },
    {
     "score": "0.598",
     "tag": "PERS",
     "entity": "Кашин",
     "range": {
      "start": 314,
      "end": 314
     }
    },
    {
     "score": "0.546",
     "tag": "LOC",
     "entity": "Львов",
     "range": {
      "start": 344,
      "end": 344
     }
    },
    {
     "score": "0.182",
     "tag": "LOC",
     "entity": "списков",
     "range": {
      "start": 366,
      "end": 366
     }
    },
    {
     "score": "0.919",
     "tag": "PERS",
     "entity": "Илья Ремесло",
     "range": {
      "start": 377,
      "end": 378
     }
    },
    {
     "score": "0.694",
     "tag": "PERS",
     "entity": "Навального",
     "range": {
      "start": 384,
      "end": 384
     }
    },
    {
     "score": "0.421",
     "tag": "ORG",
     "entity": "Роскомнадзор",
     "range": {
      "start": 388,
      "end": 388
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__neg": 0.844045102596283,
     "__label__pos": 0.15597493946552277
    }
   }
  }
 },
 "md5": "ca17f2bc098ac2ed877186881435368f",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "как не вспомнить классику\n\nПодойди. Говорят,\nТы хороший русский.\nТы неподкупен. Впрочем,\nМолния, ударившая в дом, —\nТоже.\nТы не отступаешься\nОт того, что когда-то сказал.\nНо что ты сказал?\nТы честен: что думаешь, то и говоришь.\nНо что ты думаешь?\nТы храбр. Но в борьбе против кого?\nТы умён. Но кому служит твой ум?\nТы не заботишься о своей выгоде.\nА о чьей?\nТы хороший друг. Но хороших ли русских?\nСлушай же, мы знаем:\nТы наш враг. Поэтому\nМы тебя поставим к стенке.\nНо, учитывая твои заслуги и твои достоинства,\nМы поставим тебя к хорошей стенке\nИ расстреляем тебя из хороших винтовок хорошими пулями,\nА потом закопаем\nХорошей лопатой в хорошей русской земле.",
  "text": "как не вспомнить классику\n\nПодойди. Говорят,\nТы хороший русский.\nТы неподкупен. Впрочем,\nМолния, ударившая в дом,  \nТоже.\nТы не отступаешься\nОт того, что когда-то сказал.\nНо что ты сказал?\nТы честен: что думаешь, то и говоришь.\nНо что ты думаешь?\nТы храбр. Но в борьбе против кого?\nТы умён. Но кому служит твой ум?\nТы не заботишься о своей выгоде.\nА о чьей?\nТы хороший друг. Но хороших ли русских?\nСлушай же, мы знаем:\nТы наш враг. Поэтому\nМы тебя поставим к стенке.\nНо, учитывая твои заслуги и твои достоинства,\nМы поставим тебя к хорошей стенке\nИ расстреляем тебя из хороших винтовок хорошими пулями,\nА потом закопаем\nХорошей лопатой в хорошей русской земле.",
  "publishedAt": "2022-05-20 10:05:41",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.18863333333333332
     ],
     [
      "macedonian",
      0.1596777777777778
     ],
     [
      "bulgarian",
      0.14945555555555556
     ]
    ]
   },
   "ner": [
    {
     "score": "0.595",
     "tag": "PERS",
     "entity": "А",
     "range": {
      "start": 134,
      "end": 134
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9836775064468384,
     "__label__neg": 0.01634247973561287
    }
   }
  }
 },
 "md5": "96cac4b590afdc262b50066061954cc2",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Теперь, кстати, очевидно, что Олега Кашина уже никогда не внесут в список иноагентов. \n\nПотому что мы видим, как прямо сейчас некоторые телеграмм-сетки продвигают историю о том, какой Олег Кашин хороший человек. Прямо и неприкрыто замазывая его своей однозначной репутацией и однозначной позицией по войне. \n\nЧтобы уж наверняка Олега Кашина никогда не вынесли из списка, с помощью которого ФБК будет пытаться лишить Кашина привычной ему жизни. \n\nИ, конечно, те кто составляет списки иноагентов тоже заметили эту чудесную ситуацию. И будут долго и с наслаждением смотреть, как «Хорошие Русские» выдавливают Кашина прямо в их, «Плохих Русских», жернова.\n\nИдеальное описание того, как настоящему русскому в этом бесконечном аду русской жизни остается только выть.",
  "text": "Теперь, кстати, очевидно, что Олега Кашина уже никогда не внесут в список иноагентов. \n\nПотому что мы видим, как прямо сейчас некоторые телеграмм-сетки продвигают историю о том, какой Олег Кашин хороший человек. Прямо и неприкрыто замазывая его своей однозначной репутацией и однозначной позицией по войне. \n\nЧтобы уж наверняка Олега Кашина никогда не вынесли из списка, с помощью которого ФБК будет пытаться лишить Кашина привычной ему жизни. \n\nИ, конечно, те кто составляет списки иноагентов тоже заметили эту чудесную ситуацию. И будут долго и с наслаждением смотреть, как «Хорошие Русские» выдавливают Кашина прямо в их, «Плохих Русских», жернова.\n\nИдеальное описание того, как настоящему русскому в этом бесконечном аду русской жизни остается только выть.",
  "publishedAt": "2022-05-20 10:14:55",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.28800000000000003
     ],
     [
      "bulgarian",
      0.17405555555555552
     ],
     [
      "ukrainian",
      0.17284444444444447
     ]
    ]
   },
   "ner": [
    {
     "score": "0.902",
     "tag": "PERS",
     "entity": "Олега Кашина",
     "range": {
      "start": 7,
      "end": 8
     }
    },
    {
     "score": "1.241",
     "tag": "PERS",
     "entity": "Олег Кашин",
     "range": {
      "start": 33,
      "end": 34
     }
    },
    {
     "score": "0.761",
     "tag": "LOC",
     "entity": "войне",
     "range": {
      "start": 50,
      "end": 50
     }
    },
    {
     "score": "0.833",
     "tag": "ORG",
     "entity": "ФБК",
     "range": {
      "start": 66,
      "end": 66
     }
    },
    {
     "score": "0.497",
     "tag": "LOC",
     "entity": "Кашина",
     "range": {
      "start": 70,
      "end": 70
     }
    },
    {
     "score": "0.497",
     "tag": "PERS",
     "entity": "Кашина",
     "range": {
      "start": 102,
      "end": 102
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9099447131156921,
     "__label__neg": 0.09007532149553299
    }
   }
  }
 },
 "md5": "03fcbb568225f3e659507f432bcf85f3",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Ахаха действительно стоит ли?",
  "text": "Ахаха действительно стоит ли?",
  "publishedAt": "2022-05-20 11:40:55",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.3701234567901235
     ],
     [
      "bulgarian",
      0.3237037037037037
     ],
     [
      "macedonian",
      0.2062962962962963
     ]
    ]
   },
   "ner": [
    {
     "score": "0.214",
     "tag": "LOC",
     "entity": "Ахаха",
     "range": {
      "start": 0,
      "end": 0
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000100135803223,
     "__label__neg": 0.000010000003385357559
    }
   }
  }
 },
 "md5": "7c1f8a1b346c3cd353d6189022ab77bb",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "А чего, когда Россия бомбила Сирию кто-то вводил ей запрет на импорт полупроводников?\n\n<a href=\"https://t.me/vladivostok1978/9794\" target=\"_blank\" rel=\"noopener\">https://t.me/vladivostok1978/9794</a>",
  "text": "А чего, когда Россия бомбила Сирию кто-то вводил ей запрет на импорт полупроводников?\n\nhttps://t.me/vladivostok1978/9794",
  "publishedAt": "2022-05-21 12:58:29",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.20722713864306785
     ],
     [
      "bulgarian",
      0.19153392330383479
     ],
     [
      "macedonian",
      0.1723598820058997
     ]
    ]
   },
   "ner": [
    {
     "score": "0.920",
     "tag": "LOC",
     "entity": "Россия",
     "range": {
      "start": 4,
      "end": 4
     }
    },
    {
     "score": "1.178",
     "tag": "LOC",
     "entity": "Сирию",
     "range": {
      "start": 6,
      "end": 6
     }
    }
   ],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 0.9433515667915344,
     "__label__neg": 0.056668512523174286
    }
   }
  }
 },
 "md5": "4910847acfafc1ef119318c45102a8a4",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Тут Буш-мл. толкал речь на примере России о том, как плохо, когда нет системы сдержек и противовесов в государстве, и в итоге<i> «один человек принимает решение начать абсолютно неоправданное и безжалостное вторжение в Ирак, ой, то есть в Украину»</i>. Да! Прямо так и сказал! (на 30й секунде)",
  "text": "Тут Буш-мл. толкал речь на примере России о том, как плохо, когда нет системы сдержек и противовесов в государстве, и в итоге «один человек принимает решение начать абсолютно неоправданное и безжалостное вторжение в Ирак, ой, то есть в Украину». Да! Прямо так и сказал! (на 30й секунде)",
  "publishedAt": "2022-05-21 09:07:55",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.21994177583697228
     ],
     [
      "bulgarian",
      0.20379912663755462
     ],
     [
      "serbian",
      0.1500873362445415
     ]
    ]
   },
   "ner": [
    {
     "score": "0.547",
     "tag": "PERS",
     "entity": "Буш-мл",
     "range": {
      "start": 1,
      "end": 1
     }
    },
    {
     "score": "1.397",
     "tag": "LOC",
     "entity": "России",
     "range": {
      "start": 7,
      "end": 7
     }
    },
    {
     "score": "0.788",
     "tag": "LOC",
     "entity": "Ирак",
     "range": {
      "start": 37,
      "end": 37
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__neg": 0.7264608144760132,
     "__label__pos": 0.27355924248695374
    }
   }
  }
 },
 "md5": "ae237c2762a109288681c566d4e4975a",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:08 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "А еще бывает так: русский — хороший, а человек — говно",
  "text": "А еще бывает так: русский   хороший, а человек   говно",
  "publishedAt": "2022-05-21 12:40:58",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.1395238095238095
     ],
     [
      "ukrainian",
      0.1287301587301587
     ],
     [
      "macedonian",
      0.11690476190476184
     ]
    ]
   },
   "ner": [],
   "sentiments": {
    "emotion": "positive",
    "classes": {
     "__label__pos": 1.0000097751617432,
     "__label__neg": 0.000010208746971329674
    }
   }
  }
 },
 "md5": "d6212fb2de1075a74f655366e71d373b",
 "createdAt": "2022-05-21 09:07:55"
}
2022-05-21 09:08:09 -> {
 "type": "telegram",
 "url": "https://t.me/Baronova",
 "metadata": {
  "scraper": "b940bfda-d145-4385-9dc6-c347dcd0fbcf",
  "channel": {
   "name": "@Baronova",
   "title": "Baronova",
   "description": "Ежедневный иллюстрированный канал обо всем на свете<br><br>Красивая фамилия — Честные глаза<br><br>Для личного: mbaronova@gmail.com",
   "image": "https://cdn4.telegram-cdn.org/file/jBsiQQYgph0x0jnkskhcsRU7ZqVriNkUqz6u5wuBqAn4TmOWa4EzqI3HHIARBde1GZsbA9PApNSH7rEaYC5efLltlakNAwYKn-ijdCrHNm3NlaYorUwg1sWlAQqnvmXxw1nVjA3yP9EhNSug3JBRdEZjN3LqEWFkSliww7y1xoHYY-FKzmPnCxpLLWmxyPWGMsZW_ZuuRDEIEtp_jyW8Hu6_q_wOrc8QQjZ56tRzhgPQttzG5J7VdpBolrKQsCUx2o8VbmhtDpbT6iz0rJ1dr2NDBd-1hlUdcmXeJhzdxjnHTbp2xZbR9y1PvKpfpD-KBDuJDtOaD0LSez14FBvmNQ.jpg"
  },
  "html": "Кухня раздвинулась до размеров страны, страна\nПостепенно оказалась совсем другой,\nНазывал её Софьей Власьевной, а она\nЕбанутая, как Настасья Филипповна, дорогой,\nОна с приветом, и этот ее привет\nПерехлестывает через каждый порог,\nСоздается впечатление, что Сахаров, правь он несколько лет,\nТоже бы попытался остаться на третий срок.\nДалее что-нибудь нужно про день сурка,\nНочь песца, вечер скрипучих петель,\nИ досок, и снега, и, кстати сказать, снегá\nПеремешаны со снегами и медведями, и метель\nИз снегов и спящих медведей то стелется, то кружит,\nВсячески меняется, но остается такой,\nЧтобы поэт, что внутри неё лежит,\nСтолбенел от того, что он мёртвый и молодой\nЗаранее. Лежит, как в окне бабочка или оса,\nПричём с издевательской улыбочкой на устах,\nОт того, что зима литературе, как гопник, смотрит в глаза,\nА литература только и может ответить кудах-кудах.\n\nАлексей Сальников",
  "text": "Кухня раздвинулась до размеров страны, страна\nПостепенно оказалась совсем другой,\nНазывал её Софьей Власьевной, а она\nЕбанутая, как Настасья Филипповна, дорогой,\nОна с приветом, и этот ее привет\nПерехлестывает через каждый порог,\nСоздается впечатление, что Сахаров, правь он несколько лет,\nТоже бы попытался остаться на третий срок.\nДалее что-нибудь нужно про день сурка,\nНочь песца, вечер скрипучих петель,\nИ досок, и снега, и, кстати сказать, снегá\nПеремешаны со снегами и медведями, и метель\nИз снегов и спящих медведей то стелется, то кружит,\nВсячески меняется, но остается такой,\nЧтобы поэт, что внутри неё лежит,\nСтолбенел от того, что он мёртвый и молодой\nЗаранее. Лежит, как в окне бабочка или оса,\nПричём с издевательской улыбочкой на устах,\nОт того, что зима литературе, как гопник, смотрит в глаза,\nА литература только и может ответить кудах-кудах.\n\nАлексей Сальников",
  "publishedAt": "2022-05-21 02:39:17",
  "nlp": {
   "language": {
    "locale": "ru",
    "scores": [
     [
      "russian",
      0.27064444444444447
     ],
     [
      "bulgarian",
      0.1889222222222222
     ],
     [
      "macedonian",
      0.15031111111111106
     ]
    ]
   },
   "ner": [
    {
     "score": "0.620",
     "tag": "PERS",
     "entity": "Софьей Власьевной",
     "range": {
      "start": 14,
      "end": 15
     }
    },
    {
     "score": "1.056",
     "tag": "PERS",
     "entity": "Настасья Филипповна",
     "range": {
      "start": 22,
      "end": 23
     }
    },
    {
     "score": "1.006",
     "tag": "PERS",
     "entity": "Сахаров",
     "range": {
      "start": 44,
      "end": 44
     }
    },
    {
     "score": "0.411",
     "tag": "PERS",
     "entity": "Столбенел",
     "range": {
      "start": 119,
      "end": 119
     }
    }
   ],
   "sentiments": {
    "emotion": "unrecognised",
    "classes": {
     "__label__pos": 0.7958999872207642,
     "__label__neg": 0.20412002503871918
    }
   }
  }
 },
 "md5": "78d3db717090af27c1e7fb7525e602bc",
 "createdAt": "2022-05-21 09:07:55"
}



```
