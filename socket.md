<!-- Socket.io -->

# 1. Push notification

## 1.1. Checkout / Renew successfully

    - Event: zpCallback

### 1.1.1. Response

- Zalopay callback data string; [ZPDataCallback](/monorepo/libs/shared/src/lib/dto/txn/zalopay.dto.ts)

## 1.2. Billing

### 1.2.1. Create Bill

- Event: createdBill

### 1.2.2. Update Bill

- Event: updatedBill

### 1.2.3. Response

[Bill](/monorepo/apps/pkg-mgmt/src/schemas/billing.schema.ts)

## 1.3. Todos

### 1.3.1. Create Todos

- Event: createdTodos

### 1.3.2. Update Todos

- Event: updatedTodos

### 1.3.3. Response

[TodoList](/monorepo/apps/pkg-mgmt/src/schemas/todos.schema.ts)

## 1.4. Join Group successfully

- Event: joinGr

### 1.4.1. Response

[AddGrMbReqDto](/monorepo/libs/shared/src/lib/dto/pkg-mgmt/group.dto.ts)

## 1.5. Task Reminders

-Event: taskReminder

[GetGrDto_Task](/monorepo/libs/shared/src/lib/dto/pkg-mgmt/task.dto.ts)
