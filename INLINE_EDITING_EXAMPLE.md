# نحوه استفاده از Inline Editing در MRT

## مثال استفاده:

```tsx
import Demo from "@/app/components/Datatable/MRT";

const MyComponent = () => {
  const model = getEntityModel("myEntity");

  // تابع ذخیره‌سازی تغییرات
  const handleInlineSave = async (rowId: string, values: any) => {
    try {
      const res = await fetch(`/api/myEntity/${rowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        return true; // موفقیت
      }
      return false; // خطا
    } catch (error) {
      console.error("Error saving:", error);
      return false;
    }
  };

  return (
    <Demo
      model={model}
      enableInlineEditing={true}
      editableColumns={["name", "description", "price", "quantity"]}
      onInlineSave={handleInlineSave}
      isEditable={true}
      isDeleteable={true}
    />
  );
};

export default MyComponent;
```

## پارامترهای جدید:

### enableInlineEditing

- **نوع:** `boolean`
- **پیش‌فرض:** `false`
- **توضیح:** فعال‌سازی حالت ویرایش inline برای گرید

### editableColumns

- **نوع:** `string[]`
- **پیش‌فرض:** `[]`
- **توضیح:** لیست نام ستون‌هایی که قابل ویرایش هستند

### onInlineSave

- **نوع:** `(rowId: string, values: any) => Promise<boolean>`
- **پیش‌فرض:** `undefined`
- **توضیح:** تابع callback که برای ذخیره تغییرات فراخوانی می‌شود. باید یک Promise برگرداند که در صورت موفقیت true و در صورت خطا false برمی‌گرداند.

## نکات مهم:

1. **فعال‌سازی ویرایش:** برای استفاده از inline editing، باید `enableInlineEditing={true}` را تنظیم کنید.

2. **تعیین ستون‌های قابل ویرایش:** در آرایه `editableColumns` نام دقیق accessor ستون‌ها را وارد کنید.

3. **پیاده‌سازی تابع ذخیره:** تابع `onInlineSave` باید به سرور درخواست بفرستد و نتیجه را به صورت boolean برگرداند.

4. **سازگاری با سایر ویژگی‌ها:** می‌توانید inline editing را همزمان با سایر ویژگی‌های MRT مثل فیلتر، مرتب‌سازی و... استفاده کنید.

## مثال پیشرفته با validation:

```tsx
const handleInlineSave = async (rowId: string, values: any) => {
  // اعتبارسنجی قبل از ارسال
  if (!values.name || values.name.length < 3) {
    ColoredToast("danger", "نام باید حداقل 3 کاراکتر باشد");
    return false;
  }

  if (values.price && values.price < 0) {
    ColoredToast("danger", "قیمت نمی‌تواند منفی باشد");
    return false;
  }

  try {
    const res = await apiFetch(`/api/products/${rowId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (res.ok) {
      ColoredToast("success", "تغییرات با موفقیت ذخیره شد");
      return true;
    } else {
      const error = await res.json();
      ColoredToast("danger", error.message || "خطا در ذخیره‌سازی");
      return false;
    }
  } catch (error) {
    ColoredToast("danger", "خطای ارتباط با سرور");
    return false;
  }
};
```

## نحوه کار:

1. کاربر روی آیکون ویرایش در ردیف کلیک می‌کند
2. ستون‌های مشخص شده در `editableColumns` به حالت ویرایش در می‌آیند
3. کاربر تغییرات را اعمال می‌کند
4. با کلیک روی دکمه ذخیره، تابع `onInlineSave` فراخوانی می‌شود
5. در صورت موفقیت، تغییرات اعمال و گرید به‌روزرسانی می‌شود
6. در صورت خطا، پیام مناسب نمایش داده می‌شود
