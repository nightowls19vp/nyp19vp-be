# Socket.io

## Push notification

# Checkout / Renew successfully

    - Event: zpCallback

## Response

    - Zalopay callback data string;

<a href="/monorepo/libs/shared/src/lib/dto/txn/zalopay.dto.ts" target="_top">ZPDataCallback</a>

# Billing

## Create Bill

    - Event: createdBill

## Update Bill

    - Event: updatedBill

## Response

<a href="/monorepo/apps/pkg-mgmt/src/schemas/billing.schema.ts" target="_top">Bill</a>

# Todos

## Create Todos

    - Event: createdTodos

## Update Todos

    - Event: updatedTodos

## Response

<a href="/monorepo/apps/pkg-mgmt/src/schemas/todos.schema.ts" target="_top">TodoList</a>

# Join Group successfully

    - Event: joinGr

## Response

<a href="/monorepo/libs/shared/src/lib/dto/pkg-mgmt/group.dto.ts" target="_top">AddGrMbReqDto</a>

```json
{
  "_id_": "<GroupId>",
  "user": "<Id of user who just joined group>",
  "addedBy": "<Id of user who sent the invitation>"
}
```

# Task Reminders

    -Event: taskReminder

## Response

<a href="/monorepo/libs/shared/src/lib/dto/pkg-mgmt/task.dto.ts" target="_top">GetGrDto_Task</a>
