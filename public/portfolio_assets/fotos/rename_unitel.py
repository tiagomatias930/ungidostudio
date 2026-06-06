#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
from uuid import uuid4


def list_files(folder: Path, exclude_name: str) -> list[Path]:
    files = [
        p
        for p in folder.iterdir()
        if p.is_file() and p.name != exclude_name and not p.name.startswith(".")
    ]
    return sorted(files, key=lambda p: p.name.lower())


def build_target_name(prefix: str, index: int, suffix: str) -> str:
    return f"{prefix}{index}{suffix}"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Renomeia os arquivos da pasta atual para um padrão crescente."
    )
    parser.add_argument(
        "prefix",
        help="Prefixo do novo nome, por exemplo: unitel, foto, imagem",
    )
    parser.add_argument(
        "--start",
        type=int,
        default=1,
        help="Número inicial da sequência. Padrão: 1",
    )
    parser.add_argument("--dry-run", action="store_true", help="Mostra as renomeações sem alterar os arquivos.")
    args = parser.parse_args()

    folder = Path.cwd()
    script_name = Path(__file__).name
    files = list_files(folder, script_name)

    if not files:
        print("Nenhum arquivo encontrado para renomear.")
        return 0

    plan: list[tuple[Path, Path]] = []
    for offset, src in enumerate(files):
        target_name = build_target_name(args.prefix, args.start + offset, src.suffix)
        plan.append((src, folder / target_name))

    for src, dst in plan:
        print(f"{src.name} -> {dst.name}")

    if args.dry_run:
        return 0

    temp_map: list[tuple[Path, Path]] = []
    for src, _ in plan:
        temp_name = f".tmp_rename_{uuid4().hex}{src.suffix}"
        temp_path = folder / temp_name
        src.rename(temp_path)
        temp_map.append((temp_path, src))

    for offset, (temp_path, original_src) in enumerate(temp_map):
        target_name = build_target_name(
            args.prefix,
            args.start + offset,
            original_src.suffix,
        )
        temp_path.rename(folder / target_name)

    print("Renomeação concluída.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
