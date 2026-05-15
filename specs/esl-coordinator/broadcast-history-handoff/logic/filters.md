# Broadcast History — 2-Layer Filter 邏輯

---

## 架構

Filter 分兩層：

- **Layer 1（主分類）**：以 pill 按鈕顯示，互斥選擇
- **Layer 2（子分類）**：依 Layer 1 選擇動態出現，以較小 pill 顯示

---

## Layer 1 選項

| Value | Label | 說明 |
|-------|-------|------|
| `all` | All | 顯示所有 groups |
| `mine` | My Classes | 僅顯示 `data-teacher="mine"` 的 groups |
| `subject` | By Subject | 展開 Layer 2 顯示 subject 子選項 |
| `teacher` | By ESL Teacher | 展開 Layer 2 顯示 teacher 子選項 |

---

## Layer 2 選項

### By Subject（`activeL1 === 'subject'`）

| Value | Label |
|-------|-------|
| `esl` | ESL |
| `math` | Math |
| `science` | Science |

### By ESL Teacher（`activeL1 === 'teacher'`）

| Value | Label |
|-------|-------|
| `mine` | My Classes |
| `chen` | Ms. Chen |
| `garcia` | Mr. Garcia |

---

## Filter 條件

每個 `.session-group` 帶有兩個 data attribute：

```html
<div class="session-group"
     data-teacher="mine"
     data-subject="esl">
```

顯示 / 隱藏邏輯：

```javascript
function applyFilter() {
  document.querySelectorAll('.session-group').forEach(function(group) {
    var teacher = group.getAttribute('data-teacher');
    var subject = group.getAttribute('data-subject');
    var show = true;

    if (activeL1 === 'mine')
      show = teacher === 'mine';
    else if (activeL1 === 'subject' && activeL2)
      show = subject === activeL2;
    else if (activeL1 === 'teacher' && activeL2)
      show = teacher === activeL2;

    group.style.display = show ? '' : 'none';
  });
}
```

---

## Layer 2 顯示條件

| activeL1 | Layer 2 顯示 |
|----------|-------------|
| `all` | 不顯示 |
| `mine` | 不顯示 |
| `subject` | 顯示 subject 子選項 |
| `teacher` | 顯示 teacher 子選項 |

---

## 狀態重置規則

- 切換 Layer 1 → `activeL2` 重設為 `null`（清除子選項）
- Layer 2 再次點擊已選中的選項 → toggle 取消（回到 null）

---

## CSS

```css
/* Layer 1 pill */
.filter-pill { padding: 6px 14px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 600; color: #64748b; }
.filter-pill.active { background: #059669; color: #fff; border-color: #059669; }

/* Layer 2 sub-pill */
.filter-sub { padding: 5px 12px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; font-size: 11px; font-weight: 600; color: #64748b; }
.filter-sub.active { border-color: #059669; color: #059669; background: #ecfdf5; }

/* Layer 2 列（預設隱藏） */
.filter-sub-row { display: none; }
.filter-sub-row.show { display: flex; gap: 6px; flex-wrap: wrap; }
```
