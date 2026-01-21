"use client";

import type React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { CATEGORIES, CategoryKey } from "@/lib/api/board";

const TITLE_MIN = 5;
const TITLE_MAX = 50;
const CONTENT_MIN = 20;
const CONTENT_MAX = 250;
const MAX_FILE_SIZE = 1 * 1024 * 1024;

export interface BoardFormValues {
  title: string;
  content: string;
  category: CategoryKey | "";
}

interface BoardFormProps {
  initialValues: BoardFormValues;
  initialImageUrl?: string | null;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (
    data: BoardFormValues,
    options: {
      file?: File;
      removeImage: boolean;
    }
  ) => Promise<void>;
}

export function BoardForm({
  initialValues,
  initialImageUrl = null,
  loading = false,
  submitLabel = "저장",
  onSubmit,
}: BoardFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState(initialValues);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  /** 초기 이미지 세팅 (수정 페이지) */
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
    }
    // URL에서 파일명 추출
    const name = initialImageUrl?.split("/").pop() ?? null;
    setFileName(name);
  }, [initialImageUrl]);

  /** validation */
  const isTitleValid =
    formData.title.length >= TITLE_MIN && formData.title.length <= TITLE_MAX;

  const isContentValid =
    formData.content.length >= CONTENT_MIN &&
    formData.content.length <= CONTENT_MAX;

  const isFormValid = useMemo(() => {
    return isTitleValid && isContentValid && Boolean(formData.category);
  }, [isTitleValid, isContentValid, formData.category]);

  /** 이미지 선택 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE) {
      setFileError("이미지는 1MB 이하만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    setFileError(null);
    setFile(selected);
    setRemoveImage(false);

    setFileName(selected.name);

    setPreview(URL.createObjectURL(selected));
  };

  /** 이미지 제거 */
  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setFileName(null);
    setRemoveImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /** submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("입력 조건을 다시 확인해주세요.");
      return;
    }

    await onSubmit(formData, {
      file: file ?? undefined,
      removeImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 / 카테고리 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>제목</Label>
          <Input
            value={formData.title}
            maxLength={TITLE_MAX}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>카테고리</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value as CategoryKey })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 내용 */}
      <div className="space-y-2">
        <Label>내용</Label>
        <Textarea
          value={formData.content}
          maxLength={CONTENT_MAX}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="min-h-72 resize-none"
        />
      </div>

      {/* 이미지 */}
      <div className="space-y-2">
        <Label>첨부 이미지</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            파일 선택
          </Button>

          <span className="text-sm text-muted-foreground">
            JPG, PNG (최대 1MB)
          </span>
        </div>

        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {fileName && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">📎</span>
            <span className="flex-1 truncate">{fileName}</span>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-muted-foreground hover:text-red-500"
            >
              ✕
            </button>
          </div>
        )}

        {fileError && <p className="text-sm text-red-500">{fileError}</p>}

        {preview && (
          <div className="relative w-32">
            <img
              src={preview}
              className="h-32 w-32 rounded border object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
